import { create } from 'zustand'
import { getConversionHistory, getConversionDetail, getConversionResult } from '../api/imageToBim'

const useImageToBimStore = create((set) => ({
  conversions: [],
  currentConversion: null,
  currentModels: [],
  loading: false,
  uploading: false,

  fetchHistory: async () => {
    set({ loading: true })
    try {
      const res = await getConversionHistory()
      set({ conversions: res.data || [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchDetail: async (id) => {
    set({ loading: true })
    try {
      const res = await getConversionDetail(id)
      set({ currentConversion: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchResult: async (id) => {
    set({ loading: true })
    try {
      const res = await getConversionResult(id)
      set({ currentModels: res.data?.models || [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  setUploading: (uploading) => set({ uploading }),
  setCurrentConversion: (conversion) => set({ currentConversion: conversion }),
  clearCurrent: () => set({ currentConversion: null, currentModels: [] }),
}))

export default useImageToBimStore
