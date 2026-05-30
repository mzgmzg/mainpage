<script setup>
import { useQuote } from '../composables/useQuote.js'
const { quote, from, loading } = useQuote()
</script>

<template>
  <div class="quote-widget">
    <Transition name="quote-fade">
      <div v-if="!loading && quote" class="quote-content">
        <p class="quote-text">{{ quote }}</p>
        <p v-if="from" class="quote-from">—— {{ from }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.quote-widget {
  text-align: center;
  max-width: 520px;
  min-height: 3.4rem; /* 预留空间，防止加载后布局跳动 */
}
.quote-content {
  /* 容器 */
}
.quote-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-weight: 400;
}
.quote-from {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
}

/* 淡入 */
.quote-fade-enter-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.quote-fade-enter-from {
  opacity: 0;
}
</style>
