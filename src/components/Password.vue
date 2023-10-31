<template>
  <Button @click="() => emit('select')" class="password" :class="['password', { selected: props.selected }]">
    <div class="password-data">
      <div v-if="!imageLoaded" class="image-placeholder blink-loading-placeholoder"></div>
      <img
        v-if="props.password.website !== ''"
        loading="lazy"
        @load="() => (imageLoaded = true)"
        :class="['image', { loading: !imageLoaded }]"
        :src="`https://www.google.com/s2/favicons?domain=${props.password.website}&sz=128`" />
      <img v-else @load="() => (imageLoaded = true)" class="image" :src="Globe" />
      <div class="title-email">
        <h3 class="password-title">{{ props.password.title }}</h3>
        <span class="password-email">{{ getCensoredSubtitle(props.password) }}</span>
      </div>
    </div>
  </Button>
</template>

<script setup lang="ts">
export interface IPassword {
  id: string;
  title: string;
  email: string;
  login: string;
  phoneNumber: string;
  password: string;
  website: string;
  notes: string;
}

import Globe from '../assets/globe.png';
import Button from './Button.vue';
import { ref } from 'vue';

interface IProps {
  password: IPassword;
  selected: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits(['select']);
const imageLoaded = ref(false);

function getCensoredSubtitle(password: IPassword) {
  let subtitle = '';

  if (password.email !== undefined && password.email !== '') subtitle = password.email;
  else if (password.login !== undefined && password.login !== '') subtitle = password.login;
  else if (password.phoneNumber !== undefined && password.phoneNumber !== '') subtitle = password.phoneNumber;
  else return '';

  let shownPartLength = Math.ceil(subtitle.length / 3);

  return subtitle.substring(0, shownPartLength) + '*'.repeat(subtitle.length - shownPartLength);
}
</script>

<style scoped>
.password {
  display: block;
  width: 100%;
  height: 80px;
  margin-bottom: 15px;
  background-color: transparent;
  padding: 20px;
  transition: background-color var(--transition-duration);
}

.password.selected {
  background-color: rgb(var(--accent-color));
}

.password-data {
  display: flex;
  align-items: center;
  column-gap: 15px;
  height: 100%;
}

.image-placeholder {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.image {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: var(--border-radius);
}

.image.loading {
  position: absolute;
  opacity: 0;
}

.title-email {
  height: 100%;
  width: calc(100% - 55px);
}

.password-title {
  text-align: left;
  font-size: 2.1rem;
  line-height: 2.2rem;
  padding-bottom: 0.5rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.password-email {
  display: block;
  white-space: nowrap;
  text-align: left;
  width: 100%;
  font-size: 1.2rem;
  color: rbg(var(--font-color));
  opacity: 0.5;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
