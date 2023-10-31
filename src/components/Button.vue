<template>
  <button
    @mousedown="(event) => !props.noRipples && initiateRipple(event.offsetX, event.offsetY)"
    :disabled="props.loading ? props.loading : false"
    class="button">
    <div
      v-if="!props.noRipples"
      v-for="ripple in ripples"
      class="ripple"
      :style="{ left: ripple.x - 5 + 'px', top: ripple.y - 5 + 'px' }"></div>
    <Transition name="fade">
      <div v-if="props.loading" class="loading-container">
        <div class="loading-indicator" />
      </div>
    </Transition>
    <slot class="me-5" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface IRipple {
  x: number;
  y: number;
  id: number;
}

interface IProps {
  loading?: boolean;
  noRipples?: boolean;
}

const props = defineProps<IProps>();
const ripples = ref<IRipple[]>([]);
const rippleTimeout = ref<null | number>(null);

function initiateRipple(x: number, y: number) {
  let newRipple: IRipple = { x, y, id: Date.now() * Math.random() };
  ripples.value.push(newRipple);

  if (rippleTimeout.value !== null) clearTimeout(rippleTimeout.value);

  rippleTimeout.value = setTimeout(() => {
    ripples.value = [];
  }, 400);
}
</script>

<style scoped>
.button {
  background-color: rgb(var(--accent-color));
  padding: 4px 8px;
  height: 32px;
  color: rgb(var(--font-color));
  border-radius: var(--border-radius);
  font-size: 1.7rem;
  border: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button:not(:disabled)::after {
  content: '';
  position: absolute;
  background-color: rgb(var(--font-color));
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: opacity var(--transition-duration);
}

.button:hover::after {
  opacity: 0.1;
}

.button:active::after {
  opacity: 0.2;
}

.loading-container {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  justify-content: center;
  align-items: center;
}

.loading-indicator {
  height: 60%;
  border: 4px solid rgb(var(--font-color));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.ripple {
  position: absolute;
  aspect-ratio: 1/1;
  transform-origin: 50% 50%;
  width: 10px;
  border-radius: 50%;
  background-color: rgba(var(--font-color), 0.3);
  animation: scale 400ms linear forwards;
  pointer-events: none;
}

@keyframes scale {
  to {
    scale: 15;
    opacity: 0;
  }
}
</style>
