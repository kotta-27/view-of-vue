import { ref, watchEffect } from 'vue'

export type Locale = 'ja' | 'en'

/** 言語を増やすときはここに足し、content の各ファイルに同じキーの翻訳を加える */
export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
]
export type Theme = 'light' | 'dark'

const stored = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // 保存できない環境では、そのページの間だけ設定が効く
  }
}

const initialLocale = (): Locale => {
  const v = LOCALES.find(l => l.code === stored('vov-locale'))
  if (v) return v.code
  if (typeof navigator === 'undefined') return 'ja'
  return LOCALES.find(l => navigator.language.startsWith(l.code))?.code ?? 'en'
}

const initialTheme = (): Theme => {
  const v = stored('vov-theme')
  if (v === 'light' || v === 'dark') return v
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const locale = ref<Locale>(initialLocale())
export const theme = ref<Theme>(initialTheme())
export const easy = ref(stored('vov-easy') === '1')

/** 言語ごとの値を今の言語で読む */
export const pick = <T>(m: { ja: T; en: T }): T => m[locale.value]

/** 実行時に作る短い文を今の言語で返す */
export const say = (ja: string, en: string) => (locale.value === 'ja' ? ja : en)

export function applySettings() {
  watchEffect(() => {
    document.documentElement.lang = locale.value
    document.documentElement.dataset.theme = theme.value
    save('vov-locale', locale.value)
    save('vov-theme', theme.value)
    save('vov-easy', easy.value ? '1' : '0')
  })
}
