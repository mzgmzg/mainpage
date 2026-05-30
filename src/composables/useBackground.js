import { ref, watch, onMounted } from 'vue'

const SOURCES = {
  bing: async () => {
    const resp = await fetch('/api/bing/HPImageArchive.aspx?format=js&idx=0&n=1')
    const data = await resp.json()
    if (data?.images?.[0]?.url) {
      return `https://www.bing.com${data.images[0].url}`
    }
    return null
  },
  picsum: async () => {
    // Picsum 返回随机图片，附带重定向到真实图片 URL
    const resp = await fetch('https://picsum.photos/1920/1080?random')
    return resp.url
  },
  gradient: async () => null,
  custom: async (settings) => settings.customBgUrl || null
}

export function useBackground(settings) {
  const bgUrl = ref('')
  const loaded = ref(false)

  async function fetchBackground() {
    loaded.value = false
    try {
      const fetcher = SOURCES[settings.bgSource] || SOURCES.gradient
      const url = await fetcher(settings)
      bgUrl.value = url || ''
    } catch {
      bgUrl.value = ''
    }
    loaded.value = true
  }

  onMounted(() => fetchBackground())
  watch(() => [settings.bgSource, settings.customBgUrl], () => fetchBackground())

  return { bgUrl, loaded }
}
