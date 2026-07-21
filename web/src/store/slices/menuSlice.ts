import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { fetchMenus as fetchMenusApi } from '../../api'

export interface MenuItem {
  id: number
  name: string
  path: string | null
  icon: string
  parentId: number | null
  sortOrder: number
  isVisible: boolean
  permission: string
  children: MenuItem[]
}

interface MenuState {
  items: MenuItem[]
  loading: boolean
  error: string | null
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchMenus = createAsyncThunk('menu/fetchMenus', async () => {
  const response = await fetchMenusApi()
  return response.data
})

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch menus'
      })
  },
})

export default menuSlice.reducer