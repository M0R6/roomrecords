<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <div class="social-icons">
        <a href="https://instagram.com/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white"  :icon="['fab', 'instagram']" />
        </a>
        <a href="https://x.com/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white" :icon="['fab', 'x-twitter']" />
        </a>
        <a href="https://youtube.com/@M0R6" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white" :icon="['fab', 'youtube']" />
        </a>
        <a href="https://twitch.tv/nrfntr" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white" :icon="['fab', 'twitch']" />
        </a>
        <a href="https://discord.com/users/944014822603907102" target="_blank">
          <font-awesome-icon class="h-6 mx-auto cursor-pointer text-white" :icon="['fab', 'discord']" />
        </a>
      </div>
      <p>
        &copy; 2024 <a href="https://linktr.ee/nrfntr/" target="_blank">MORG</a><br>
        Background picture by <a href="https://unsplash.com/@introspectivedsgn" target="_blank">Eric Mclean</a>
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
  background-color: black;
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
