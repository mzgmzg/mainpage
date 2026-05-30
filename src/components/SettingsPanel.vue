<script setup>
import { inject, ref, watch, computed } from 'vue'
import ConfigTools from './ConfigTools.vue'

const props = defineProps({
  visible: Boolean,
  mode: { type: String, default: 'full' }
})
const emit = defineEmits(['update:visible'])

const settings = inject('settings')
const bookmarks = inject('bookmarks')

const activeTab = ref('bookmarks')
const form = ref({ name: '', url: '' })
const editingId = ref(null)

// 计算当前背景图片 URL，用于保存
const currentImageUrl = computed(() => {
  if (settings.bgSource === 'custom' && settings.customBgUrl) {
    return settings.customBgUrl
  }
  return null
})

watch(() => props.visible, (v) => {
  if (v) {
    activeTab.value = props.mode === 'add' ? 'bookmarks' : 'bookmarks'
    form.value = { name: '', url: '' }
    editingId.value = null
  }
})

function save() {
  const { name, url } = form.value
  if (!name.trim() || !url.trim()) return
  if (editingId.value) {
    const idx = bookmarks.findIndex(b => b.id === editingId.value)
    if (idx !== -1) {
      bookmarks[idx].name = name.trim()
      bookmarks[idx].url = url.trim()
    }
  } else {
    bookmarks.push({
      id: Date.now().toString(36),
      name: name.trim(),
      url: url.trim()
    })
    if (props.mode === 'add') { emit('update:visible', false); return }
  }
  form.value = { name: '', url: '' }
  editingId.value = null
}

function editBookmark(bm) {
  editingId.value = bm.id
  form.value = { name: bm.name, url: bm.url }
}

function cancelEdit() {
  editingId.value = null
  form.value = { name: '', url: '' }
}

function removeBookmark(id) {
  if (!confirm('确定删除这个书签？')) return
  const idx = bookmarks.findIndex(b => b.id === id)
  if (idx !== -1) bookmarks.splice(idx, 1)
  if (editingId.value === id) cancelEdit()
}

// 拖拽排序
let dragIndex = null
function onDragStart(index, e) {
  dragIndex = index
  e.dataTransfer.effectAllowed = 'move'
}
function onDragOver(index, e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}
function onDrop(index) {
  if (dragIndex === null || dragIndex === index) return
  const item = bookmarks.splice(dragIndex, 1)[0]
  bookmarks.splice(index, 0, item)
  dragIndex = null
}
function onDragEnd() {
  dragIndex = null
}

function close() { emit('update:visible', false) }

function faviconUrl(url) {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32` }
  catch { return '' }
}

// 保存当前背景图片
function saveBackgroundImage() {
  // 从 DOM 中获取当前背景图片的实际 URL
  const bgEl = document.querySelector('.bg-image')
  if (!bgEl) return
  const style = getComputedStyle(bgEl).backgroundImage
  const match = style.match(/url\(["']?([^"')]+)["']?\)/)
  if (!match) return
  const url = match[1]
  // 通过 fetch 下载然后触发下载
  fetch(url)
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'background-' + Date.now() + '.jpg'
      a.click()
      URL.revokeObjectURL(a.href)
    })
    .catch(() => {
      // 跨域回退：直接打开图片
      window.open(url, '_blank')
    })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="visible" class="overlay" @click.self="close">
        <!-- 快速添加 -->
        <div v-if="mode === 'add'" class="quick-add">
          <div class="qa-header">
            <h3>添加书签</h3>
          </div>
          <div class="qa-body">
            <input v-model="form.name" class="input" placeholder="名称" @keydown.enter="save" />
            <input v-model="form.url" class="input" placeholder="URL" @keydown.enter="save" />
            <div class="qa-actions">
              <button class="btn btn-primary" @click="save">保存</button>
              <button class="btn" @click="close">取消</button>
            </div>
          </div>
        </div>

        <!-- 完整设置面板 -->
        <div v-else class="panel">
          <!-- 侧边栏 -->
          <div class="sidebar">
            <div class="sidebar-brand">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>设置</span>
            </div>
            <nav class="sidebar-nav">
              <button
                :class="['nav-item', { active: activeTab === 'bookmarks' }]"
                @click="activeTab = 'bookmarks'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span>书签</span>
              </button>
              <button
                :class="['nav-item', { active: activeTab === 'background' }]"
                @click="activeTab = 'background'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>背景</span>
              </button>
              <button
                :class="['nav-item', { active: activeTab === 'data' }]"
                @click="activeTab = 'data'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
                <span>数据</span>
              </button>
            </nav>
            <button class="sidebar-close" @click="close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- 内容区 -->
          <div class="content">
            <!-- 书签 -->
            <div :class="['tab-content', { active: activeTab === 'bookmarks' }]">
              <h3 class="tab-title">管理书签</h3>
              <div class="bm-list">
                <div
                  v-for="(bm, index) in bookmarks"
                  :key="bm.id"
                  class="bm-row"
                  :class="{ 'bm-dragging': dragIndex === index }"
                  draggable="true"
                  @dragstart="onDragStart(index, $event)"
                  @dragover="onDragOver(index, $event)"
                  @drop="onDrop(index)"
                  @dragend="onDragEnd"
                >
                  <div class="bm-drag-handle" title="拖动排序">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                      <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                      <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
                    </svg>
                  </div>
                  <img :src="faviconUrl(bm.url)" class="bm-icon" alt="" />
                  <div class="bm-info">
                    <span class="bm-name">{{ bm.name }}</span>
                    <span class="bm-url">{{ bm.url }}</span>
                  </div>
                  <div class="bm-actions">
                    <button class="btn-sm" @click="editBookmark(bm)">编辑</button>
                    <button class="btn-sm btn-sm-del" @click="removeBookmark(bm.id)">删除</button>
                  </div>
                </div>
                <p v-if="bookmarks.length === 0" class="empty-hint">暂无书签</p>
              </div>
              <div class="bm-form">
                <p class="bm-form-title">{{ editingId ? '编辑书签' : '添加书签' }}</p>
                <input v-model="form.name" class="input" placeholder="名称" />
                <input v-model="form.url" class="input" placeholder="URL" />
                <div class="bm-form-actions">
                  <button class="btn btn-primary" @click="save">保存</button>
                  <button v-if="editingId" class="btn" @click="cancelEdit">取消</button>
                </div>
              </div>
            </div>

            <!-- 背景 -->
            <div :class="['tab-content', { active: activeTab === 'background' }]">
              <h3 class="tab-title">背景图片</h3>
              <div class="bg-source-list">
                <label
                  v-for="opt in [
                    { key: 'bing', label: '必应每日', desc: '每日自动更新' },
                    { key: 'picsum', label: '随机风景', desc: '每次刷新更换' },
                    { key: 'gradient', label: '纯色渐变', desc: '简洁稳定' },
                    { key: 'custom', label: '自定义 URL', desc: '使用自己的图片' }
                  ]"
                  :key="opt.key"
                  :class="['bg-option', { selected: settings.bgSource === opt.key }]"
                >
                  <input type="radio" v-model="settings.bgSource" :value="opt.key" />
                  <span class="bg-opt-label">{{ opt.label }}</span>
                  <span class="bg-opt-desc">{{ opt.desc }}</span>
                </label>
              </div>
              <div v-if="settings.bgSource === 'custom'" class="bg-custom">
                <input v-model="settings.customBgUrl" class="input" placeholder="https://..." />
              </div>
              <button class="btn btn-save-img" @click="saveBackgroundImage">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                保存当前背景图
              </button>
            </div>

            <!-- 数据 -->
            <div :class="['tab-content', { active: activeTab === 'data' }]">
              <h3 class="tab-title">数据管理</h3>
              <p class="tab-desc">导出配置为 JSON 文件，或从文件导入。所有数据仅保存在本地浏览器中。</p>
              <ConfigTools />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ===== Overlay ===== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* ===== 快速添加 ===== */
.quick-add {
  width: 380px;
  background: var(--panel-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.qa-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--glass-border);
}
.qa-header h3 { font-size: 0.95rem; font-weight: 600; }
.qa-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; }
.qa-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }

/* ===== 设置面板 ===== */
.panel {
  width: 600px;
  max-height: 72vh;
  background: var(--panel-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  display: flex;
  overflow: hidden;
}

/* ===== 侧边栏 ===== */
.sidebar {
  width: 160px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--glass-border);
  padding: 1rem 0;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0 0.5rem;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.6rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.nav-item:hover {
  background: var(--glass-hover);
  color: var(--text-primary);
}
.nav-item.active {
  background: var(--glass-hover);
  color: var(--accent);
}
.sidebar-close {
  margin: 0.5rem 0.7rem 0;
  padding: 0.4rem;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 0.75rem;
}
.sidebar-close:hover {
  background: var(--glass-hover);
  color: var(--text-primary);
}

/* ===== 内容区 ===== */
.content {
  flex: 1;
  min-width: 0;
  min-height: 380px;
  overflow-y: auto;
  position: relative;
}
.tab-content {
  padding: 1.25rem;
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s cubic-bezier(0.22, 0.61, 0.36, 1),
              transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
  transform: translateY(6px);
}
.tab-content.active {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.tab-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.tab-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

/* ===== 书签列表 ===== */
.bm-list { margin-bottom: 0.75rem; }
.bm-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0;
  cursor: default;
  transition: opacity 0.15s;
}
.bm-row.bm-dragging {
  opacity: 0.3;
}
.bm-row + .bm-row { border-top: 1px solid var(--glass-border); }
.bm-drag-handle {
  flex-shrink: 0;
  cursor: grab;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.15s;
}
.bm-drag-handle:hover {
  color: var(--text-secondary);
}
.bm-drag-handle:active {
  cursor: grabbing;
}
.bm-icon {
  width: 22px; height: 22px;
  border-radius: 4px;
  flex-shrink: 0;
}
.bm-info { flex: 1; min-width: 0; }
.bm-name { display: block; font-size: 0.85rem; font-weight: 500; }
.bm-url {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 1px;
}
.bm-actions { display: flex; gap: 0.3rem; flex-shrink: 0; }
.btn-sm {
  padding: 0.25rem 0.55rem;
  border: 1px solid var(--glass-border);
  border-radius: 5px;
  background: var(--glass-bg);
  color: var(--text-secondary);
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-sm:hover { background: var(--glass-hover); color: var(--text-primary); }
.btn-sm-del { color: #e85555; border-color: rgba(232, 85, 85, 0.2); }
.btn-sm-del:hover { background: rgba(232, 85, 85, 0.08); }
.empty-hint { text-align: center; color: var(--text-muted); font-size: 0.82rem; padding: 1rem 0; }

/* 书签表单 */
.bm-form {
  padding-top: 0.75rem;
  border-top: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.bm-form-title { font-size: 0.8rem; font-weight: 500; }
.bm-form-actions { display: flex; gap: 0.4rem; }

/* ===== 背景选项 ===== */
.bg-source-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}
.bg-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.bg-option:hover {
  background: var(--glass-hover);
}
.bg-option.selected {
  border-color: var(--accent);
  background: rgba(74, 108, 247, 0.06);
}
.bg-option input[type="radio"] {
  accent-color: var(--accent);
  width: 15px; height: 15px;
  cursor: pointer;
  flex-shrink: 0;
}
.bg-opt-label {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 5rem;
}
.bg-opt-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.bg-custom { margin-bottom: 0.5rem; }

.btn-save-img {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: var(--glass-bg);
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-save-img:hover { background: var(--glass-hover); color: var(--text-primary); }

/* ===== 通用 ===== */
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-primary:hover { opacity: 0.88; color: #fff; }

/* ===== 弹窗出入动画 ===== */
.panel-enter-active {
  transition: opacity 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.panel-leave-active {
  transition: opacity 0.2s cubic-bezier(0.55, 0, 1, 1);
}
.panel-enter-active .panel,
.panel-enter-active .quick-add {
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
              opacity 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.panel-leave-active .panel,
.panel-leave-active .quick-add {
  transition: transform 0.2s cubic-bezier(0.55, 0, 1, 1),
              opacity 0.15s cubic-bezier(0.55, 0, 1, 1);
}
.panel-enter-from, .panel-leave-to { opacity: 0; }
.panel-enter-from .panel, .panel-enter-from .quick-add {
  transform: scale(0.92) translateY(16px);
  opacity: 0;
}
.panel-leave-to .panel, .panel-leave-to .quick-add {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
