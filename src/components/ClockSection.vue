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
  font-size: 2rem;
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}
.time {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 200;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  line-height: 1;
  color: var(--text-primary);
  font-feature-settings: "tnum";
}
.date {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 0.75rem;
  letter-spacing: 0.03em;
}
</style>
