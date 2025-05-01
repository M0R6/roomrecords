<template>
  <div class="josef">
    <div id="disini" class="w-screen h-[56px] border-0 p-1 m-0 bg-black" :class="{ 'hidden': hidden }">
      <div @click="hideIt" class="cursor-pointer">
        <div class="inline-block p-2">
          <font-awesome-icon class="h-6 ml-1 mt-1 cursor-pointer text-white" icon="xmark" />
        </div>
        <a href="https://sndo.ffm.to/55mdjb6" target="_blank">
          <div class="mt-[-56px] text-center p-[12px] text-2xl">
            <h1 class="text-white">
              <span>Stream</span>
              <span class="text-blue-300">MORG's "Wait On You"</span>
              <span>now!</span>
            </h1>
          </div>
        </a>
      </div>
    </div>
    <nav class="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-5 px-4 shadow-lg">
      <div class="container mx-auto flex justify-center items-center">
      <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 text-center">
        <li>
        <a href="#spotify" class="relative font-medium text-lg hover:text-green-400 transition-colors duration-300 group">
          Spotify
          <span class="absolute left-0 bottom-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        </li>
        <li>
        <a href="#youtube" class="relative font-medium text-lg hover:text-red-400 transition-colors duration-300 group">
          YouTube
          <span class="absolute left-0 bottom-0 w-0.5 bg-red-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        </li>
        <li>
        <a href="#contact" class="relative font-medium text-lg hover:text-purple-400 transition-colors duration-300 group">
          Contacts
          <span class="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        </li>
      </ul>
      </div>
    </nav>
    <div class="bg-container mx-auto w-screen h-screen border-0 p-0 m-0" :style="backgroundStyle">
      <div class="flex-auto text-center text-4xl">
        <a href="">
          <!-- <h1 class="pt-[15px] text-white josef2">
            <span>Morgan</span> <br />
            <span>Room</span> <br />
            <span>Records</span>
          </h1> -->
          <v-img class="mx-auto mt-3 d-flex justify-center" height="300" width="300" :src="require('~/assets/images/mrr.svg')"></v-img>
        </a>
      </div>
      <div class="mx-auto justify-center flex">
        <!-- <iframe width="560" height="202" src="https://www.bandlab.com/embed/?id=77dde34a-1640-ef11-86c3-000d3a42581b" allowfullscreen></iframe> -->
      </div>
      <div>
        <h1 class="pt-10 text-center text-3xl text-white josef2">MORG's Music</h1>
      </div>
      <div id="spotify">
        <h1 class="pt-10 text-center text-3xl text-white josef2">Listen on Spotify</h1>
        <div class="flex justify-center">
          <iframe
            src="https://open.spotify.com/embed/track/73TDTh7iFO0mdhfLs8lokn?utm_source=generator"
            width="300"
            height="380"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"
            class="rounded-lg pt-3"
          ></iframe>
        </div>
      </div>
      <div id="youtube">
        <h1 class="pt-10 text-center text-3xl text-white josef2">Latest YouTube Videos</h1>
        <YouTubeVideos :videos="videos"/>
      </div>
      <!-- <div>
        <h1 class="pt-10 text-center text-3xl text-white josef2">Tracks on BandLab</h1>
        <BandLabEmbed :tracks="tracks" />
      </div> -->
    </div>
    <footer id="contact">
      <Footer />
    </footer>
  </div>
</template>

<style>
.bg-container {
  height: 100vh;
  width: 100vw;
  overflow: auto; /* Ensure content can scroll */
  /* background-color: black;  */
}
</style>

<script>
import YouTubeVideos from "@/components/YouTubeVideos.vue";
import BandLabEmbed from "@/components/BandLabEmbed.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    YouTubeVideos,
    BandLabEmbed,
    Footer,
  },
  data() {
    return {
      hidden: false,
      isModalVisible: false,
      selectedVideoUrl: '',
      videos: [
        { id: "4At0dI8xJa4" },
        { id: "Wz9BlivgSbo" },
        { id: "KG5fkBOLg4c" },
        { id: "-Zm_VqCsCCY" },
        { id: "15xQoUNMWVc" },
        { id: "4Sqw-GwACNI" },
        { id: "E2OZb9yknjU" },
        { id: "b3KM9OthMoA" },
        { id: "-W01JTUmr9s" },
        { id: "djzBGrzEWzI" },
        { id: "_CUD9lIzxBo" },
        { id: "80DxoS3t9vg" },
        { id: "KluIuQGYeM0" },
        { id: "pcrVyJj6CYk" },
      ],
      tracks: [
        { id: "77dde34a-1640-ef11-86c3-000d3a42581b" },
        // Add more BandLab track IDs as needed
      ],
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${require('~/assets/images/bg.jpg')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      };
    },
  },
  methods: {
    hideIt() {
      this.hidden = !this.hidden;
    },    
  },
  mounted() {
    // Force reactivity to ensure background image is applied
    this.$forceUpdate();
  },
};
</script>
