<template>
  <DragArea v-if="isDesktopApp()" />
  <div class="container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import DragArea from './components/DragArea.vue';
import isDesktopApp from './utils/isDesktopApp';
</script>

<style scoped>
.container {
  height: 100%;
  padding: 50px 150px;
  overflow: auto;
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
