import { ref, watch } from 'vue'

export function useTheme(settings) {
  const isDark = ref(true)

  function applyTheme(mode) {
    if (mode === 'auto') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = mode === 'dark'
    }
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  watch(() => settings.theme, applyTheme, { immediate: true })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settings.theme === 'auto') applyTheme('auto')
  })

  function toggle() {
    settings.theme = isDark.value ? 'light' : 'dark'
  }

  return { isDark, toggle }
}
