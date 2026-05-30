<script setup>
import { inject, ref, onMounted } from 'vue'

const settings = inject('settings')

const engines = [
  { key: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { key: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { key: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=' }
]

const query = ref('')
const inputEl = ref(null)

onMounted(() => {
  inputEl.value?.focus()
})

function search() {
  const q = query.value.trim()
  if (!q) return
  const engine = engines.find(e => e.key === settings.searchEngine) || engines[0]
  window.open(engine.url + encodeURIComponent(q), '_blank')
}

function switchEngine(key) {
  settings.searchEngine = key
}
</script>

<template>
  <div class="search-bar">
    <div class="search-box">
      <button
        class="engine-btn"
        :title="engines.find(e => e.key === settings.searchEngine)?.name"
        @click="switchEngine(engines[(engines.findIndex(e => e.key === settings.searchEngine) + 1) % engines.length].key)"
      >
        <!-- Google -->
        <svg v-if="settings.searchEngine === 'google'" width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <!-- Bing -->
        <svg v-else-if="settings.searchEngine === 'bing'" width="18" height="18" viewBox="0 0 24 24">
          <path fill="#008373" d="M4.5 18.5 9 4l5 4.5L9 20z"/>
          <path fill="#00A4EF" d="M9 4c0 0 3.5 1.5 6 5l4 7.5L13.5 20 9 4z"/>
        </svg>
        <!-- 百度 -->
        <svg v-else width="18" height="18" viewBox="0 0 24 24">
          <rect x="3" y="5" width="7" height="7" rx="1" fill="#DE4948"/>
          <rect x="14" y="5" width="7" height="7" rx="1" fill="#2932E1"/>
          <rect x="3" y="14" width="7" height="4" rx="1" fill="#2932E1"/>
          <rect x="14" y="14" width="7" height="4" rx="1" fill="#DE4948"/>
        </svg>
      </button>
      <div class="divider" />
      <input
        ref="inputEl"
        v-model="query"
        class="search-input"
        :placeholder="'搜索 ' + (engines.find(e => e.key === settings.searchEngine)?.name || '') + '...'"
        @keydown.enter="search"
      />
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 600px;
}
.search-box {
  display: flex;
  align-items: center;
  height: 52px;
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.25s, box-shadow 0.25s;
  overflow: hidden;
}
.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(126, 184, 255, 0.1);
}
.engine-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.engine-btn:hover {
  background: var(--glass-hover);
}
.divider {
  width: 1px;
  height: 24px;
  background: var(--glass-border);
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  height: 100%;
  padding: 0 1.1rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 1.05rem;
  outline: none;
}
.search-input::placeholder {
  color: var(--text-muted);
}
</style>
