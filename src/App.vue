<script setup>
import { provide, reactive, ref, watch } from 'vue'
import Background from './components/Background.vue'
import ClockSection from './components/ClockSection.vue'
import WeatherWidget from './components/WeatherWidget.vue'
import SearchBar from './components/SearchBar.vue'
import QuoteWidget from './components/QuoteWidget.vue'
import BookmarkGrid from './components/BookmarkGrid.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const DEFAULT_BOOKMARKS = [
  { id: '1', name: 'GitHub', url: 'https://github.com' },
  { id: '2', name: 'Bilibili', url: 'https://www.bilibili.com' },
  { id: '3', name: '知乎', url: 'https://www.zhihu.com' },
  { id: '4', name: '微博', url: 'https://weibo.com' },
  { id: '5', name: '百度', url: 'https://www.baidu.com' },
  { id: '6', name: '掘金', url: 'https://juejin.cn' }
]

const DEFAULT_SETTINGS = {
  searchEngine: 'google',
  theme: 'auto',
  weatherCity: '',
  bgSource: 'bing',
  customBgUrl: ''
}

function loadFromStorage(key, defaults) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return defaults
}

const settings = reactive(loadFromStorage('hp_settings', DEFAULT_SETTINGS))
const bookmarks = reactive(loadFromStorage('hp_bookmarks', DEFAULT_BOOKMARKS))

watch(settings, (v) => localStorage.setItem('hp_settings', JSON.stringify(v)), { deep: true })
watch(bookmarks, (v) => localStorage.setItem('hp_bookmarks', JSON.stringify(v)), { deep: true })

provide('settings', settings)
provide('bookmarks', bookmarks)

const panelVisible = ref(false)
const panelMode = ref('full')

function openAdd() { panelMode.value = 'add'; panelVisible.value = true }
function openSettings() { panelMode.value = 'full'; panelVisible.value = true }
</script>

<template>
  <Background />
  <div class="overlay" />
  <div class="top-bar">
    <WeatherWidget />
    <div class="top-actions">
      <button class="top-btn" @click="openSettings" title="设置">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
      <ThemeToggle />
    </div>
  </div>
  <main class="content">
    <div class="center-section">
      <ClockSection />
      <SearchBar />
      <QuoteWidget />
    </div>
    <div class="bottom-section">
      <BookmarkGrid @open-add="openAdd" />
    </div>
  </main>
  <SettingsPanel v-model:visible="panelVisible" :mode="panelMode" />
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
  z-index: 0;
}
.top-bar {
  position: fixed;
  top: 1.25rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.top-actions {
  display: flex;
  gap: 0.5rem;
}
.top-btn {
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: var(--glass-bg);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.top-btn:hover {
  background: var(--glass-hover);
  color: var(--text-primary);
}
.content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
}
.center-section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}
.bottom-section {
  flex: 0 0 auto;
  padding-bottom: 1.5rem;
}
</style>
