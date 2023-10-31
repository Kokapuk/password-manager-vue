<template>
  <div :class="['bg', { hide: !props.show }]">
    <div :class="['content', { hide: !props.show }]">
      <div class="header">
        <h1 class="w-100">{{ props.title }}</h1>
        <Button @click="() => emit('close')" class="close"><Close class="icon" /></Button>
      </div>
      <div class="seperator"></div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface IProps {
  title: string;
  show: boolean;
}

import Button from './Button.vue';
import Close from './icons/Close.vue';

const props = defineProps<IProps>();
const emit = defineEmits(['close']);
</script>

<style scoped>
.bg {
  display: flex;
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  transition: opacity var(--transition-duration);
  justify-content: center;
  align-items: center;
}

.bg.hide {
  pointer-events: none;
  opacity: 0;
}

.content {
  background-color: rgb(var(--bg-dark-color));
  width: 500px;
  padding: 30px;
  border-radius: var(--border-radius);
  transition: scale var(--transition-duration);
}

.content.hide {
  scale: 0.85;
}

.header {
  width: 100%;
  display: flex;
}

.close {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.seperator {
  width: 100%;
  height: 2px;
  background-color: rgb(var(--font-color), 0.1);
  margin: 15px 0 15px 0;
}
</style>
