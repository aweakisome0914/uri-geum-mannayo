'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepLayout } from '@/components/create/StepLayout'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { useCreateStore } from '@/store/createStore'

export default function MessagePage() {
  const router = useRouter()
  const { message, setMessage } = useCreateStore()
  const [focused, setFocused] = useState(false)

  const handleContinue = () => {
    router.push('/create/anniversary')
  }

  return (
    <StepLayout
      title="まだ伝えられていない気持ちは、ありますか？"
      back="/create/memory"
    >
      <div className="flex flex-col gap-10">
        {/* Letter area */}
        <div
          className="relative"
          style={{
            background: focused ? 'rgba(255,255,255,0.85)' : 'transparent',
            borderRadius: '8px',
            transition: 'background 0.4s ease',
            padding: focused ? '16px 0' : '0',
          }}
        >
          {/* Decorative quote mark */}
          {!focused && !message && (
            <div
              className="absolute -top-2 -left-1 font-display text-[80px] leading-none pointer-events-none select-none"
              style={{ color: 'rgba(200,165,181,0.18)' }}
            >
              "
            </div>
          )}

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`いつもありがとう。\n離れていても、あなたのことを想っています。`}
            rows={7}
            className="w-full bg-transparent resize-none focus:outline-none font-serif text-[16px] leading-[1.9] text-[#1A1A1A] placeholder:text-[#C8C0BC]"
            style={{
              borderBottom: '1.5px solid rgba(26,26,26,0.15)',
              paddingBottom: '12px',
            }}
          />
        </div>

        {/* Nudge for empty message */}
        {!message && !focused && (
          <p className="text-[12px] text-[#BBB] text-center tracking-wide -mt-6">
            一言だけでも大丈夫です
          </p>
        )}

        <PrimaryButton onClick={handleContinue} disabled={!message.trim()}>
          この想いをのせる
        </PrimaryButton>
      </div>
    </StepLayout>
  )
}
