<script setup>
import { useClock } from '../composables/useClock.js'

const { timeText, dateText, greeting } = useClock()
</script>

<template>
  <div class="clock-section">
    <p class="greeting">{{ greeting }}</p>
    <p class="time">{{ timeText }}</p>
    <p class="date">{{ dateText }}</p>
  </div>
</template>

<style scoped>
.clock-section {
  text-align: center;
  user-select: none;
}
.greeting {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.time {
  font-family: "Fira Code", "Menlo", "Consolas", monospace;
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--text-primary);
  font-feature-settings: "tnum";
}
.date {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 0.75rem;
}
</style>
