<template>
  <div class="video-grid-container">
    <div class="video-grid">
      <div class="video" v-for="video in videos.slice(0, 6)" :key="video.id">
        <iframe :src="getVideoUrl(video.id)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  </div>
 </template>
 
 <script>
 export default {
   props: {
     videos: {
       type: Array,
       required: true
     }
   },
   methods: {
     getVideoUrl(videoId) {
       return `https://www.youtube.com/embed/${videoId}`;
     },
     handleVideoClick(videoId) {
      this.$emit('video-clicked', videoId);
    }
   }
 }
 </script>

<style scoped>
.video-grid-container {
  margin: 10px 40px 40px 40px; /* Add margin to the container */
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.video {
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  cursor: pointer; /* Add cursor pointer to indicate clickable items */
}

.video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Responsive styles */
@media (max-width: 1500px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>