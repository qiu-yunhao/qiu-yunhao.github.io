import { computed, reactive } from 'vue'
import zhCN from '@/locales/zh-CN'
import enUS from '@/locales/en-US'

const LOCALE_KEY = 'blog-locale'
const DEFAULT_LOCALE = 'zh-CN'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const saved = window.localStorage.getItem(LOCALE_KEY)
  if (saved && messages[saved]) {
    return saved
  }

  const browserLocale = window.navigator.language.toLowerCase()
  return browserLocale.startsWith('zh') ? 'zh-CN' : 'en-US'
}

const state = reactive({
  locale: DEFAULT_LOCALE,
})

const resolveMessage = (locale, key) =>
  key.split('.').reduce((value, part) => value?.[part], messages[locale])

const applyLocale = (locale) => {
  state.locale = messages[locale] ? locale : DEFAULT_LOCALE

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_KEY, state.locale)
    document.documentElement.lang = state.locale
  }
}

export const initializeLocale = () => {
  applyLocale(getInitialLocale())
}

export const useLocale = () => {
  const locale = computed(() => state.locale)

  const setLocale = (nextLocale) => {
    applyLocale(nextLocale)
  }

  const t = (key) => resolveMessage(state.locale, key) ?? key

  return {
    locale,
    t,
    setLocale,
    locales: Object.keys(messages),
  }
}
