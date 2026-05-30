import { ref, onMounted, onUnmounted } from 'vue'

function getGreeting(h) {
  if (h >= 5 && h < 12) return '早上好'
  if (h >= 12 && h < 18) return '下午好'
  return '晚上好'
}

const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export function useClock() {
  const timeText = ref('')
  const dateText = ref('')
  const greeting = ref('')
  let timer = null

  function tick() {
    const d = new Date()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    const s = String(d.getSeconds()).padStart(2, '0')
    timeText.value = `${h}:${m}:${s}`
    dateText.value = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]}`
    greeting.value = getGreeting(d.getHours())
  }

  tick()
  onMounted(() => { timer = setInterval(tick, 1000) })
  onUnmounted(() => clearInterval(timer))

  return { timeText, dateText, greeting }
}
