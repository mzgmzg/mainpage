import { ref, onMounted } from 'vue'

export function useQuote() {
  const quote = ref('')
  const from = ref('')
  const loading = ref(true)

  async function fetchQuote() {
    loading.value = true
    try {
      const resp = await fetch('https://v1.hitokoto.cn/')
      const data = await resp.json()
      quote.value = data.hitokoto
      from.value = data.from || ''
    } catch {
      quote.value = ''
      from.value = ''
    }
    loading.value = false
  }

  onMounted(() => fetchQuote())

  return { quote, from, loading, refresh: fetchQuote }
}
