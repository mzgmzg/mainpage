<script setup>
import { inject } from 'vue'
import { exportConfig, importConfig, resetConfig } from '../composables/useConfig.js'

const settings = inject('settings')
const bookmarks = inject('bookmarks')

function handleExport() {
  exportConfig(settings, bookmarks)
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const data = await importConfig(file)
      Object.assign(settings, data.settings)
      bookmarks.splice(0, bookmarks.length, ...data.bookmarks)
      alert('配置导入成功')
    } catch (err) {
      alert('导入失败：' + err.message)
    }
  }
  input.click()
}

function handleReset() {
  if (!confirm('确定要恢复默认配置吗？当前配置将被覆盖。')) return
  resetConfig(settings, bookmarks)
}
</script>

<template>
  <div class="config-tools">
    <button class="btn" @click="handleExport">导出配置</button>
    <button class="btn" @click="handleImport">导入配置</button>
    <button class="btn btn-danger" @click="handleReset">恢复默认</button>
  </div>
</template>

<style scoped>
.config-tools {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.btn-danger {
  color: #e85555;
  border-color: rgba(232, 85, 85, 0.2);
}
.btn-danger:hover {
  background: rgba(232, 85, 85, 0.06);
  color: #e85555;
}
</style>
