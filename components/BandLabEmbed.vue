<template>
   <div class="bandlab-container">
     <div class="bandlab-embed" v-for="track in tracks" :key="track.id">
       <iframe :src="getTrackUrl(track.id)" frameborder="0" allowfullscreen></iframe>
     </div>
   </div>
 </template>
 
 <script>
 export default {
   props: {
     tracks: {
       type: Array,
       required: true
     }
   },
   methods: {
     getTrackUrl(trackId) {
       return `https://www.bandlab.com/embed/?id=${trackId}`;
     }
   }
 }
 </script>
 
 <style scoped>
 .bandlab-container {
   display: flex;
   flex-direction: column;
   align-items: center;
 }
 
 .bandlab-embed {
   margin: 10px 0;
 }
 
 .bandlab-embed iframe {
   width: 560px;
   height: 202px;
 }
 
 /* Responsive styles */
 @media (max-width: 768px) {
   .bandlab-embed iframe {
     width: 100%;
     height: auto;
   }
 }
 </style>
 