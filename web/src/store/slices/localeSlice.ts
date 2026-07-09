import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { setLocale as setI18nLocale, type Locale } from '../../i18n'

interface LocaleState {
  locale: Locale
}

const saved = (localStorage.getItem('locale') as Locale) || 'zh-CN'
setI18nLocale(saved)

const initialState: LocaleState = {
  locale: saved,
}

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload
      setI18nLocale(action.payload)
      localStorage.setItem('locale', action.payload)
    },
  },
})

export const { setLocale: changeLocale } = localeSlice.actions
export default localeSlice.reducer
