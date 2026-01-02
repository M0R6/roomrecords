#!/usr/bin/env node
"use strict";

// Lightweight script to fetch newest videos from a YouTube channel using
// YouTube's RSS/Atom feed. No API key required.
// Usage:
//   node scripts/fetch-youtube.js --channel-id UCxxxx
//   node scripts/fetch-youtube.js --url https://www.youtube.com/channel/UCxxxx
//   node scripts/fetch-youtube.js --url https://www.youtube.com/user/username
// Options:
//   --max N        Limit number of returned videos (default: all in feed)
//   --output FILE  Write JSON output to FILE (default: prints to stdout)

const { XMLParser } = require('fast-xml-parser');

function getArg(name) {
  const idx = process.argv.findIndex(a => a === name);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return null;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

async function fetchText(url) {
  if (typeof fetch !== 'undefined') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} when fetching ${url}`);
    return await res.text();
  }
  // Fallback for older Node: use http/https
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
    // /channel/UCxxxx
    const chIdx = parts.indexOf('channel');
    if (chIdx >= 0 && parts[chIdx + 1]) return { type: 'channel', id: parts[chIdx + 1] };
    // /user/username
    const userIdx = parts.indexOf('user');
    if (userIdx >= 0 && parts[userIdx + 1]) return { type: 'user', id: parts[userIdx + 1] };
    // /c/customName or just a pathname (custom url) - we'll try to resolve page for channelId
    return { type: 'custom', id: parts[0] || null };
  } catch (err) {
    return null;
  }
}

async function resolveChannelIdFromCustomUrl(url) {
  // Fetch the channel page HTML and try to find the channelId (UC...)
  const html = await fetchText(url);
  // common patterns
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

async function main() {
  const channelIdArg = getArg('--channel-id');
  const urlArg = getArg('--url');
  const maxArg = getArg('--max');
  const outputArg = getArg('--output');
  const max = maxArg ? parseInt(maxArg, 10) : null;

  try {
    let xml = null;
    if (channelIdArg) {
      xml = await fetchFeedByChannelId(channelIdArg);
    } else if (urlArg) {
      const parsed = extractChannelIdFromUrl(urlArg);
      if (!parsed) throw new Error('Could not parse provided URL');
      if (parsed.type === 'channel') {
        xml = await fetchFeedByChannelId(parsed.id);
      } else if (parsed.type === 'user') {
        xml = await fetchFeedByUser(parsed.id);
      } else {
        // try to resolve channel id by fetching the page
        const resolved = await resolveChannelIdFromCustomUrl(urlArg);
        if (!resolved) throw new Error('Could not resolve channel id from custom URL');
        xml = await fetchFeedByChannelId(resolved);
      }
    } else {
      console.error('Please provide --channel-id OR --url');
      process.exit(2);
    }

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);

    // YouTube feed is an Atom feed: feed.entry is the list
    const entries = (parsed.feed && parsed.feed.entry) ? parsed.feed.entry : [];
    const normalized = Array.isArray(entries) ? entries : (entries ? [entries] : []);

    const videos = normalized.map(e => {
      // e['yt:videoId'] or e['yt:videoId'] depends on parser
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

    const json = JSON.stringify(out, null, 2);
    if (outputArg) {
      const fs = require('fs');
      fs.writeFileSync(outputArg, json, 'utf8');
      console.log(`Wrote ${out.length} items to ${outputArg}`);
    } else {
      console.log(json);
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
