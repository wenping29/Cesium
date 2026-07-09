import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type MenuMode = 'header' | 'sidebar' | 'sider-top'

interface LayoutState {
  menuMode: MenuMode
}

const initialState: LayoutState = {
  menuMode: (localStorage.getItem('menuMode') as MenuMode) || 'header',
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setMenuMode: (state, action: PayloadAction<MenuMode>) => {
      state.menuMode = action.payload
      localStorage.setItem('menuMode', action.payload)
    },
  },
})

export const { setMenuMode } = layoutSlice.actions
export default layoutSlice.reducer
