<script setup>
defineProps({
  bookmark: { type: Object, required: true }
})

function faviconUrl(url) {
  try {
    const host = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`
  } catch {
    return ''
  }
}
</script>

<template>
  <a
    class="bookmark-item"
    :href="bookmark.url"
    :title="bookmark.name"
    draggable="true"
  >
    <div class="icon-wrap">
      <img :src="faviconUrl(bookmark.url)" class="bookmark-icon" alt="" />
    </div>
    <span class="bookmark-name">{{ bookmark.name }}</span>
  </a>
</template>

<style scoped>
.bookmark-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 0.5rem;
  border-radius: 14px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;
  min-width: 84px;
}
.bookmark-item:hover {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--glass-bg);
  transition: background 0.2s;
}
.bookmark-item:hover .icon-wrap {
  background: rgba(255, 255, 255, 0.15);
}
.bookmark-icon {
  width: 28px;
  height: 28px;
  border-radius: 4px;
}
.bookmark-name {
  font-size: 0.78rem;
  font-weight: 450;
  color: var(--text-secondary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
}
</style>
