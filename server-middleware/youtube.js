const { XMLParser } = require('fast-xml-parser');
const { URL } = require('url');

function getQuery(req) {
  // req.url may be '/?channelId=...'
  const q = new URL(req.url, 'http://localhost');
  return Object.fromEntries(q.searchParams.entries());
}

async function fetchText(url) {
  if (typeof fetch !== 'undefined') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} when fetching ${url}`);
    return await res.text();
  }
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    lib
      .get(url, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode} when fetching ${url}`));
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function extractChannelIdFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const chIdx = parts.indexOf('channel');
    if (chIdx >= 0 && parts[chIdx + 1]) return { type: 'channel', id: parts[chIdx + 1] };
    const userIdx = parts.indexOf('user');
    if (userIdx >= 0 && parts[userIdx + 1]) return { type: 'user', id: parts[userIdx + 1] };
    return { type: 'custom', id: parts[0] || null };
  } catch (err) {
    return null;
  }
}

async function resolveChannelIdFromCustomUrl(url) {
  const html = await fetchText(url);
  const re1 = /"channelId":"(UC[^"]+)"/i;
  const m1 = html.match(re1);
  if (m1) return m1[1];
  const re2 = /<link itemprop="channelId" content="(UC[^"]+)">/i;
  const m2 = html.match(re2);
  if (m2) return m2[1];
  const re3 = /"externalId":"(UC[^"]+)"/i;
  const m3 = html.match(re3);
  if (m3) return m3[1];
  return null;
}

async function fetchFeedByChannelId(channelId) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const xml = await fetchText(feedUrl);
  return xml;
}

async function fetchFeedByUser(user) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?user=${user}`;
  const xml = await fetchText(feedUrl);
  return xml;
}

module.exports = async function (req, res, next) {
  const q = getQuery(req);
  const channelId = q.channelId || q.channel_id || q.channel || null;
  const url = q.url || null;
  const max = q.max ? parseInt(q.max, 10) : null;

  try {
    let xml = null;
    if (channelId) {
      xml = await fetchFeedByChannelId(channelId);
    } else if (url) {
      const parsed = extractChannelIdFromUrl(url);
      if (!parsed) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Could not parse provided URL' }));
      }
      if (parsed.type === 'channel') {
        xml = await fetchFeedByChannelId(parsed.id);
      } else if (parsed.type === 'user') {
        xml = await fetchFeedByUser(parsed.id);
      } else {
        const resolved = await resolveChannelIdFromCustomUrl(url);
        if (!resolved) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Could not resolve channel id from custom URL' }));
        }
        xml = await fetchFeedByChannelId(resolved);
      }
    } else {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Please provide channelId or url query parameter' }));
    }

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);
    const entries = (parsed.feed && parsed.feed.entry) ? parsed.feed.entry : [];
    const normalized = Array.isArray(entries) ? entries : (entries ? [entries] : []);

    const videos = normalized.map(e => {
      const videoId = e['yt:videoId'] || (e['yt:videoId'] === undefined ? null : e['yt:videoId']);
      const id = videoId || (e.id && e.id['#text']) || e.id || null;
      const title = (e.title && e.title['#text']) || e.title || '';
      const published = e.published || null;
      const link = (e.link && e.link['@_href']) || (e.link && e.link.href) || null;
      const media = e['media:group'] || null;
      const thumbnail = media && media['media:thumbnail'] ? media['media:thumbnail']['@_url'] || (media['media:thumbnail'] && media['media:thumbnail']['#text']) : null;
      return { id, videoId: id, title, published, link, thumbnail };
    }).filter(v => v.videoId !== null);

    const out = max ? videos.slice(0, max) : videos;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(out));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || String(err) }));
  }
};
