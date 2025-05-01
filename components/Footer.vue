<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p class="mb-2">
        Feel free to reach out via email at <a class="hover:text-blue-300 font-black text-xl" href="mailto:halomrgn@gmail.com">halomrgn@gmail.com</a>.<br>
      </p>
      <div class="social-icons">
        <a href="https://instagram.com/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white hover:text-blue-300"  :icon="['fab', 'instagram']" />
        </a>
        <a href="https://x.com/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white hover:text-blue-300" :icon="['fab', 'x-twitter']" />
        </a>
        <a href="https://youtube.com/@M0R6" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white hover:text-blue-300" :icon="['fab', 'youtube']" />
        </a>
        <a href="https://open.spotify.com/artist/7DPc5JGMWxo7gyHxIvfyHW?si=YMuVGHZiTT67pAK1R2fp0g" target="_blank">
          <font-awesome-icon class=" h-6 mx-auto cursor-pointer text-white hover:text-blue-300" :icon="['fab', 'spotify']" />
        </a>
        <a href="https://soundcloud.com/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white hover:text-blue-300"  :icon="['fab', 'soundcloud']" />
        </a>
        <a href="https://twitch.tv/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white hover:text-blue-300" :icon="['fab', 'twitch']" />
        </a>
        <a href="https://discord.com/users/944014822603907102" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white hover:text-blue-300" :icon="['fab', 'discord']" />
        </a>
      </div>
      <p>
        &copy; 2024 <a class="hover:text-blue-300" href="https://morgann.me/" target="_blank">MORG</a><br>
        Background picture by <a class="hover:text-blue-300" href="https://unsplash.com/@introspectiveds" target="_blank">Eric Mclean</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #212121;
  color: #fff;
  padding: 1rem 0;
  width: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
}
.social-icons {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}
.social-icons a {
  color: #fff;
  margin: 0 0.5rem;
  transition: color 0.3s;
}
.social-icons a:hover {
  color: #1da1f2; /* Change this to your desired hover color */
}
.social-icon {
  font-size: 1px; /* Adjust this value as needed */
}
</style>
