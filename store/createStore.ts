'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Mood } from '@/types'

interface CreateState {
  message:              string
  anniversaryDate:      string
  nextMeetingDate:      string
  mood:                 Mood | null
  secretCode:           string   // NOT persisted — lives in memory only
  memoryImageFile:      File | null    // NOT persisted
  memoryImagePreviewUrl: string  // NOT persisted — blob URL
  setMessage:              (v: string) => void
  setAnniversaryDate:      (v: string) => void
  setNextMeetingDate:      (v: string) => void
  setMood:                 (v: Mood)   => void
  setSecretCode:           (v: string) => void
  setMemoryImage:          (file: File, previewUrl: string) => void
  reset: () => void
}

export const useCreateStore = create<CreateState>()(
  persist(
    (set) => ({
      message:               '',
      anniversaryDate:       '',
      nextMeetingDate:       '',
      mood:                  null,
      secretCode:            '',
      memoryImageFile:       null,
      memoryImagePreviewUrl: '',

      setMessage:           (v) => set({ message: v }),
      setAnniversaryDate:   (v) => set({ anniversaryDate: v }),
      setNextMeetingDate:   (v) => set({ nextMeetingDate: v }),
      setMood:              (v) => set({ mood: v }),
      setSecretCode:        (v) => set({ secretCode: v }),
      setMemoryImage: (file, previewUrl) =>
        set({ memoryImageFile: file, memoryImagePreviewUrl: previewUrl }),

      reset: () =>
        set({
          message:               '',
          anniversaryDate:       '',
          nextMeetingDate:       '',
          mood:                  null,
          secretCode:            '',
          memoryImageFile:       null,
          memoryImagePreviewUrl: '',
        }),
    }),
    {
      name: 'love-page-create',
      partialize: (state) => ({
        message:         state.message,
        anniversaryDate: state.anniversaryDate,
        nextMeetingDate: state.nextMeetingDate,
        mood:            state.mood,
        // secretCode, memoryImageFile, memoryImagePreviewUrl excluded
      }),
    }
  )
)
