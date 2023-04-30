<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
</script>

<style scoped>
.container {
  height: 100%;
  padding: 50px 150px;
}

@media (max-width: 1280px) {
  .container {
    padding: 25px 75px;
  }
}

@media (max-width: 800px) {
  .container {
    padding: 25px;
  }
}
</style>
