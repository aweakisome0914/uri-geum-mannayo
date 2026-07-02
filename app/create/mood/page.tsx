'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepLayout } from '@/components/create/StepLayout'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { useCreateStore } from '@/store/createStore'
import type { Mood } from '@/types'

const MOODS: {
  id: Mood
  label: string
  desc: string
  bg: string
  textColor: string
  accent: string
}[] = [
  {
    id: 'gentle',
    label: 'やさしい',
    desc: '穏やかで温かみのある世界観',
    bg: 'linear-gradient(145deg, #FAFAF5, #F5EDE8)',
    textColor: '#1A1A1A',
    accent: '#C8A5B5',
  },
  {
    id: 'romantic',
    label: 'ロマンチック',
    desc: '深みと情熱のある世界観',
    bg: 'linear-gradient(145deg, #1C1018, #2D1528)',
    textColor: '#F5EFE8',
    accent: '#C8956A',
  },
  {
    id: 'warm',
    label: 'あたたかい',
    desc: '太陽のような温かみのある世界観',
    bg: 'linear-gradient(145deg, #FAF0E8, #F5E8D8)',
    textColor: '#2A1A0A',
    accent: '#C87058',
  },
]

export default function MoodPage() {
  const router = useRouter()
  const { mood: storedMood, setMood } = useCreateStore()
  const [selected, setSelected] = useState<Mood | null>(storedMood)

  const handleContinue = () => {
    if (!selected) return
    setMood(selected)
    router.push('/create/preview')
  }

  return (
    <StepLayout
      title="この作品を、どんな空気にしたいですか？"
      back="/create/secret"
    >
      <div className="flex flex-col gap-6">
        {/* Mood cards */}
        <div className="flex flex-col gap-3">
          {MOODS.map(m => {
            const isSelected = selected === m.id
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className="relative w-full rounded-2xl overflow-hidden transition-all duration-300 text-left"
                style={{
                  background: m.bg,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${m.accent}, 0 8px 32px rgba(0,0,0,0.10)`
                    : '0 2px 12px rgba(0,0,0,0.06)',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <div
                      className="font-serif text-[18px] font-medium mb-1"
                      style={{ color: m.textColor }}
                    >
                      {m.label}
                    </div>
                    <div
                      className="text-[12px] opacity-60"
                      style={{ color: m.textColor }}
                    >
                      {m.desc}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      borderColor: isSelected ? m.accent : `${m.textColor}30`,
                      background: isSelected ? m.accent : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="1.8">
                        <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <PrimaryButton onClick={handleContinue} disabled={!selected}>
            この世界観でつくる
          </PrimaryButton>
        </div>
      </div>
    </StepLayout>
  )
}
