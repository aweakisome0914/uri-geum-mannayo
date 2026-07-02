'use client'

import { useState } from 'react'
import { PinInput } from '@/components/ui/PinInput'

interface Props {
  pageId: string
  onUnlock: () => void
}

type State = 'idle' | 'checking' | 'error' | 'blocked'

export function SecretCodeEntry({ pageId, onUnlock }: Props) {
  const [digits, setDigits]   = useState(['', '', '', ''])
  const [state, setState]     = useState<State>('idle')
  const [attempted, setAttempted] = useState(false)

  const isComplete = digits.every(d => d !== '')

  const handleSubmit = async () => {
    if (!isComplete || state === 'checking') return

    setState('checking')
    setAttempted(true)

    try {
      const res  = await fetch(`/api/verify/${pageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: digits.join('') }),
      })
      const data = await res.json()

      if (data.blocked) {
        setState('blocked')
        return
      }

      if (data.valid) {
        onUnlock()
      } else {
        setState('error')
        setDigits(['', '', '', ''])
        setTimeout(() => setState('idle'), 2000)
      }
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  // Auto-submit when all 4 digits are entered
  const handleChange = (next: string[]) => {
    setDigits(next)
    setState('idle')
    if (next.every(d => d !== '')) {
      setTimeout(() => {
        setDigits(current => {
          if (current.every(d => d !== '')) handleSubmit()
          return current
        })
      }, 150)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{
        background: 'linear-gradient(160deg, #FAFAF5 0%, #F0EBE8 50%, #F5F0F5 100%)',
        backgroundSize: '200% 200%',
        animation: 'bgDrift 20s ease infinite',
      }}
    >
      <div className="max-w-sm w-full flex flex-col items-center gap-12">

        {/* Lock icon */}
        <div
          className="w-20 h-20 rounded-[24px] flex items-center justify-center transition-all duration-500"
          style={{
            background: state === 'error'
              ? 'linear-gradient(145deg, #FDE8E8, #F8D8D8)'
              : 'linear-gradient(145deg, #FDE8F0, #EDE8F8)',
            boxShadow: state === 'error'
              ? '0 8px 32px rgba(200,120,120,0.20)'
              : '0 8px 32px rgba(200,165,181,0.20)',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-9 h-9"
            fill="none"
            stroke={state === 'error' ? '#C87070' : '#C8A5B5'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2.5" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-3">
          <h1 className="font-serif text-[24px] font-medium text-[#1A1A1A] leading-relaxed">
            二人だけの合言葉を<br />入れてください。
          </h1>
          <p className="text-[13px] text-[#888] leading-[1.8]">
            この作品は、あなたにだけ届いたものです。
          </p>
        </div>

        {/* Pin input */}
        <div className="w-full">
          <PinInput
            value={digits}
            onChange={handleChange}
            disabled={state === 'checking' || state === 'blocked'}
            error={state === 'error'}
          />
        </div>

        {/* Status messages */}
        <div className="h-10 flex items-center justify-center">
          {state === 'checking' && (
            <p className="text-[13px] text-[#888] tracking-wide animate-pulse">
              確かめています…
            </p>
          )}
          {state === 'error' && (
            <div className="text-center flex flex-col gap-1">
              <p className="text-[13px] text-[#C87070]">
                少し違うみたいです。
              </p>
              <p className="text-[12px] text-[#BBB]">
                二人にとって大切な日を思い出してみてください。
              </p>
            </div>
          )}
          {state === 'blocked' && (
            <p className="text-[13px] text-[#888] text-center leading-relaxed">
              少し時間をおいて、<br />もう一度試してみてください。
            </p>
          )}
          {state === 'idle' && !attempted && (
            <p className="text-[11.5px] text-[#CCC] tracking-wide">
              4桁の数字を入れると自動で開きます
            </p>
          )}
        </div>

        {/* Manual submit for accessibility */}
        {isComplete && state === 'idle' && (
          <button
            onClick={handleSubmit}
            className="text-[13px] text-[#888] underline underline-offset-4 hover:text-[#1A1A1A] transition-colors"
          >
            開く
          </button>
        )}
      </div>
    </div>
  )
}
