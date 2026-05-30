import { ref, onMounted } from 'vue'

export function useWeather(settings) {
  const city = ref('')
  const temp = ref(null)
  const desc = ref('')
  const loading = ref(true)

  onMounted(async () => {
    // 尝试获取地理位置
    let lat, lon
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      })
      lat = pos.coords.latitude
      lon = pos.coords.longitude
    } catch {
      // 降级：北京
      lat = 39.9042
      lon = 116.4074
    }

    try {
      // Open-Meteo 天气 API
      const resp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      )
      const data = await resp.json()
      if (data?.current_weather) {
        temp.value = Math.round(data.current_weather.temperature)
        const code = data.current_weather.weathercode
        desc.value = weatherCodeToText(code)
      }

      // 获取城市名（逆地理编码）
      try {
        const geoResp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh`
        )
        const geoData = await geoResp.json()
        if (geoData?.address) {
          const addr = geoData.address
          city.value = addr.city || addr.town || addr.county || addr.state || ''
        }
      } catch {
        city.value = lat === 39.9042 ? '北京' : ''
      }
    } catch {
      // 天气获取失败
    }
    loading.value = false
  })

  return { city, temp, desc, loading }
}

function weatherCodeToText(code) {
  if (code <= 1) return '晴'
  if (code <= 3) return '多云'
  if (code <= 48) return '雾'
  if (code <= 57) return '毛毛雨'
  if (code <= 67) return '雨'
  if (code <= 77) return '雪'
  if (code <= 82) return '阵雨'
  if (code <= 86) return '阵雪'
  return '雷暴'
}
