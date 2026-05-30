<script setup>
import { useBackground } from '../composables/useBackground.js'
import { inject } from 'vue'

const settings = inject('settings')
const { bgUrl, loaded } = useBackground(settings)
</script>

<template>
  <div class="bg-layer">
    <Transition name="bg-fade">
      <div
        v-if="bgUrl"
        :key="bgUrl"
        class="bg-image"
        :style="{ backgroundImage: `url(${bgUrl})` }"
      />
    </Transition>
    <div v-if="bgUrl" class="bg-blend" />
  </div>
</template>

<style scoped>
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(160deg, var(--bg-gradient-start), var(--bg-gradient-end));
}
.bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.bg-blend {
  position: absolute;
  inset: 0;
  background: var(--bg-blend-overlay);
}

/* Vue Transition：图片切换 */
.bg-fade-enter-active {
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1),
              transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.bg-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.bg-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}
.bg-fade-leave-to {
  opacity: 0;
}
</style>
