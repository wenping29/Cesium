import zhCN from './zh-CN'
import enUS from './en-US'
import type { Translations } from './zh-CN'

export type Locale = 'zh-CN' | 'en-US'

const locales: Record<Locale, Translations> = { 'zh-CN': zhCN, 'en-US': enUS }

let currentLocale: Locale = 'zh-CN'

export function setLocale(locale: Locale) {
  currentLocale = locale
}

export function getLocale() {
  return currentLocale
}

export function t(key: string): string {
  const keys = key.split('.')
  let obj: any = locales[currentLocale]
  for (const k of keys) {
    obj = obj?.[k]
  }
  return (obj as string) ?? key
}
