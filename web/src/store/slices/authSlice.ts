import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UserInfo {
  id: number
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: UserInfo | null
  tokenExpiresAt: number | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  tokenExpiresAt: (() => {
    const v = localStorage.getItem('tokenExpiresAt')
    return v ? Number(v) : null
  })(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserInfo }>,
    ) => {
      const expiresAt = Date.now() + 3600000
      state.token = action.payload.token
      state.user = action.payload.user
      state.tokenExpiresAt = expiresAt
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('tokenExpiresAt', String(expiresAt))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.tokenExpiresAt = null
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiresAt')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
