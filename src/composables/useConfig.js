export function exportConfig(settings, bookmarks) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: { ...settings },
    bookmarks: [...bookmarks]
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'homepage-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (!data.settings || !data.bookmarks) {
          throw new Error('配置文件格式不正确')
        }
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

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
  bgSource: 'picsum',
  customBgUrl: ''
}

export function resetConfig(settings, bookmarks) {
  Object.assign(settings, DEFAULT_SETTINGS)
  bookmarks.splice(0, bookmarks.length, ...DEFAULT_BOOKMARKS.map(b => ({ ...b })))
}
