import { theme } from 'antd'
import type { ThemeName } from '../store/slices/themeSlice'

const { defaultAlgorithm, darkAlgorithm } = theme

export interface ThemeConfig {
  algorithm: typeof defaultAlgorithm
  colorPrimary: string
  label: string
  headerBg: string
  siderBg: string
  headerFontColor: string
}

export const themeConfigs: Record<ThemeName, ThemeConfig> = {
  'light-blue': {
    algorithm: defaultAlgorithm,
    colorPrimary: '#1677ff',
    label: '浅蓝经典',
    headerBg: '#001529',
    siderBg: '#001529',
    headerFontColor: '#fff',
  },
  'dark-blue': {
    algorithm: darkAlgorithm,
    colorPrimary: '#1677ff',
    label: '深蓝经典',
    headerBg: '#141414',
    siderBg: '#141414',
    headerFontColor: '#fff',
  },
  'light-green': {
    algorithm: defaultAlgorithm,
    colorPrimary: '#52c41a',
    label: '极光绿',
    headerBg: '#237804',
    siderBg: '#237804',
    headerFontColor: '#fff',
  },
  'light-orange': {
    algorithm: defaultAlgorithm,
    colorPrimary: '#fa8c16',
    label: '日落橙',
    headerBg: '#ad4e00',
    siderBg: '#ad4e00',
    headerFontColor: '#fff',
  },
  'light-red': {
    algorithm: defaultAlgorithm,
    colorPrimary: '#f5222d',
    label: '烈焰红',
    headerBg: '#a8071a',
    siderBg: '#a8071a',
    headerFontColor: '#fff',
  },
}

export const themeOptions = Object.entries(themeConfigs).map(([value, cfg]) => ({
  value,
  label: cfg.label,
  color: cfg.colorPrimary,
}))
