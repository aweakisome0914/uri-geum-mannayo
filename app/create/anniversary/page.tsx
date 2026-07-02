'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepLayout } from '@/components/create/StepLayout'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { useCreateStore } from '@/store/createStore'
import { calcTogetherDays } from '@/lib/days'

function useCountUp(target: number, enabled: boolean) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || target === 0) { setDisplay(0); return }

    const duration = 1400
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed  = Math.min(now - start, duration)
      const progress = elapsed / duration
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * target))
      if (elapsed < duration) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(target)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, enabled])

  return display
}

export default function AnniversaryPage() {
  const router = useRouter()
  const { anniversaryDate, setAnniversaryDate } = useCreateStore()
  const [showDays, setShowDays] = useState(!!anniversaryDate)

  const targetDays  = anniversaryDate ? calcTogetherDays(anniversaryDate) : 0
  const displayDays = useCountUp(targetDays, showDays)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnniversaryDate(e.target.value)
    setShowDays(false)
    setTimeout(() => setShowDays(true), 50)
  }

  return (
    <StepLayout
      title="二人が始まった日を教えてください。"
      subtitle="その日から今日までの時間を、作品の中に刻みます。"
      back="/create/message"
    >
      <div className="flex flex-col gap-10">
        {/* Date input */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] tracking-[2px] text-[#888] uppercase">
            二人が始まった日
          </label>
          <input
            type="date"
            value={anniversaryDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 text-[18px] font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]/50 transition-colors"
          />
        </div>

        {/* Together Days display */}
        {anniversaryDate && (
          <div
            className="text-center py-8 transition-opacity duration-500"
            style={{ opacity: showDays ? 1 : 0 }}
          >
            <div className="text-[13px] tracking-[3px] text-[#888] mb-2 uppercase">Together</div>
            <div
              className="font-display font-semibold text-[#1A1A1A]"
              style={{ fontSize: 'clamp(64px, 20vw, 96px)', lineHeight: 1 }}
            >
              {displayDays.toLocaleString()}
            </div>
            <div className="text-[13px] tracking-[3px] text-[#888] mt-3 uppercase">Days</div>
          </div>
        )}

        <PrimaryButton
          onClick={() => router.push('/create/meeting')}
          disabled={!anniversaryDate}
        >
          二人の時間を刻む
        </PrimaryButton>
      </div>
    </StepLayout>
  )
}
