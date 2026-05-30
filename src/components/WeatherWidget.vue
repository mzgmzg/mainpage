<script setup>
import { useWeather } from '../composables/useWeather.js'
import { inject } from 'vue'

const settings = inject('settings')
const { city, temp, desc, loading } = useWeather(settings)
</script>

<template>
  <div v-if="!loading && temp !== null" class="weather">
    <span class="weather-temp">{{ temp }}°</span>
    <span class="weather-desc">{{ desc }}</span>
    <span v-if="city" class="weather-sep">·</span>
    <span v-if="city" class="weather-city">{{ city }}</span>
  </div>
</template>

<style scoped>
.weather {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.weather-temp {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}
.weather-sep {
  color: var(--text-muted);
  font-size: 0.7rem;
}
.weather-city {
  color: var(--text-muted);
}
</style>
