import { computed, reactive } from 'vue'

const THEME_KEY = 'blog-theme'
const THEMES = ['default', 'forest', 'sunset']
const DEFAULT_THEME = 'default'

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const saved = window.localStorage.getItem(THEME_KEY)
  return THEMES.includes(saved) ? saved : DEFAULT_THEME
}

const state = reactive({
  theme: DEFAULT_THEME,
})

const applyTheme = (theme) => {
  state.theme = THEMES.includes(theme) ? theme : DEFAULT_THEME

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = state.theme
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_KEY, state.theme)
  }
}

export const initializeTheme = () => {
  applyTheme(getInitialTheme())
}

export const useTheme = () => {
  const theme = computed(() => state.theme)

  const setTheme = (nextTheme) => {
    applyTheme(nextTheme)
  }

  return {
    theme,
    setTheme,
    themes: THEMES,
  }
}
