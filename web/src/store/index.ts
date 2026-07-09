import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import authReducer from './slices/authSlice'
import layoutReducer from './slices/layoutSlice'
import themeReducer from './slices/themeSlice'
import localeReducer from './slices/localeSlice'
import menuReducer from './slices/menuSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    layout: layoutReducer,
    theme: themeReducer,
    locale: localeReducer,
    menu: menuReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
