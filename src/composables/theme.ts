import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

const THEME_KEY = 'app-theme'
type ThemeMode = 'light' | 'dark' | 'system'

const preferredDark = usePreferredDark()
const theme = ref<ThemeMode>(localStorage.getItem(THEME_KEY) as ThemeMode || 'system')

export function useTheme() {
  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
    localStorage.setItem(THEME_KEY, mode)
    applyTheme()
  }

  const applyTheme = () => {
    const isDark = theme.value === 'system' 
      ? preferredDark.value 
      : theme.value === 'dark'

    document.documentElement.classList.toggle('dark', isDark)
    
    // 设置 CSS 变量
    if (isDark) {
      document.documentElement.style.setProperty('--el-bg-color', '#1c1c1e')
      document.documentElement.style.setProperty('--el-text-color-primary', '#ffffff')
      document.documentElement.style.setProperty('--el-text-color-regular', '#a8a8aa')
      document.documentElement.style.setProperty('--el-border-color', '#3a3a3c')
    } else {
      document.documentElement.style.setProperty('--el-bg-color', '#ffffff')
      document.documentElement.style.setProperty('--el-text-color-primary', '#303133')
      document.documentElement.style.setProperty('--el-text-color-regular', '#606266')
      document.documentElement.style.setProperty('--el-border-color', '#dcdfe6')
    }
  }

  // 监听系统主题变化
  watch(preferredDark, () => {
    if (theme.value === 'system') {
      applyTheme()
    }
  })

  // 初始化主题
  applyTheme()

  return {
    theme,
    setTheme
  }
} 