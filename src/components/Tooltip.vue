<template>
  <div class="tooltip">
    <slot />
    <span :class="['tooltip-text', props.positioning]">
      {{ props.text }}
      <div :class="['tooltip-arrow', props.positioning]"></div>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { TooltipPositioning } from '../types';

interface IProps {
  text: string;
  positioning: TooltipPositioning;
}

const props = defineProps<IProps>();
</script>

<style scoped>
.tooltip {
  --tooltip__arrow-size: 10px;
  --tooltip__border-opacity: 0.1;
  --tooltip__border-width: 1px;

  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.tooltip-text {
  width: max-content;
  background-color: rgb(var(--bg-light-color));
  border: var(--tooltip__border-width) solid rgb(var(--font-color), var(--tooltip__border-opacity));
  color: rgb(var(--font-color));
  font-size: 1.3rem;
  padding: 5px 10px;
  border-radius: var(--border-radius);
  position: absolute;
  z-index: 1;
  opacity: 0;
  scale: 0.9;
  pointer-events: none;
  transition: opacity var(--transition-duration), scale var(--transition-duration), background-color var(--transition-duration);
}

.tooltip-text.top {
  bottom: calc(100% + var(--tooltip__arrow-size));
}

.tooltip-text.right {
  left: calc(100% + var(--tooltip__arrow-size));
}

.tooltip-text.bottom {
  top: calc(100% + var(--tooltip__arrow-size));
}

.tooltip-text.left {
  right: calc(100% + var(--tooltip__arrow-size));
}

.tooltip-arrow {
  content: '';
  z-index: -1;
  position: absolute;
  width: var(--tooltip__arrow-size);
  height: var(--tooltip__arrow-size);
  background-color: rgb(var(--bg-light-color));
  border-right: var(--tooltip__border-width) solid rgb(var(--font-color), var(--tooltip__border-opacity));
  border-bottom: var(--tooltip__border-width) solid rgb(var(--font-color), var(--tooltip__border-opacity));
  transition: background-color var(--transition-duration), bottom var(--transition-duration);
}

.tooltip-arrow.top {
  left: calc(50% - (var(--tooltip__arrow-size) / 2));
  bottom: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  rotate: 45deg;
}

.tooltip-arrow.right {
  left: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  top: calc(50% - var(--tooltip__arrow-size) / 2);
  rotate: 135deg;
}

.tooltip-arrow.bottom {
  left: calc(50% - (var(--tooltip__arrow-size) / 2));
  top: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  rotate: 225deg;
}

.tooltip-arrow.left {
  right: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  top: calc(50% - var(--tooltip__arrow-size) / 2);
  rotate: -45deg;
}

.tooltip:hover .tooltip-text {
  opacity: 1;
  scale: 1;
}
</style>
