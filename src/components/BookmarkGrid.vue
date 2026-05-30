<script setup>
import { inject } from 'vue'
import BookmarkItem from './BookmarkItem.vue'

const bookmarks = inject('bookmarks')
const emit = defineEmits(['openAdd'])

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
</script>

<template>
  <div class="bookmark-area">
    <div class="bookmark-grid">
      <div
        v-for="(bm, index) in bookmarks"
        :key="bm.id"
        class="bookmark-cell"
        :class="{ dragging: dragIndex === index }"
        draggable="true"
        @dragstart="onDragStart(index, $event)"
        @dragover="onDragOver(index, $event)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      >
        <BookmarkItem :bookmark="bm" />
      </div>
      <button class="action-btn" @click="emit('openAdd')" title="添加书签">
        <div class="icon-wrap add-wrap">
          <span class="action-icon">+</span>
        </div>
        <span class="action-label">添加</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.bookmark-area {
  display: flex;
  justify-content: center;
}
.bookmark-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
}
.bookmark-cell {
  transition: opacity 0.2s;
}
.bookmark-cell.dragging {
  opacity: 0.3;
}
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 0.5rem;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 84px;
}
.action-btn:hover {
  background: var(--glass-bg);
  color: var(--text-secondary);
}
.icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: border-color 0.2s;
}
.add-wrap {
  border: 1.5px dashed var(--glass-border);
}
.action-btn:hover .add-wrap {
  border-color: var(--text-muted);
}
.action-icon {
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 300;
}
.action-label {
  font-size: 0.78rem;
}
</style>
