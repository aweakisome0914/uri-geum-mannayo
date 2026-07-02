'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepLayout } from '@/components/create/StepLayout'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { useCreateStore } from '@/store/createStore'
import { calcDaysUntil } from '@/lib/days'

export default function MeetingPage() {
  const router = useRouter()
  const { nextMeetingDate, setNextMeetingDate } = useCreateStore()
  const [date, setDate] = useState(nextMeetingDate)

  const handleAdd = () => {
    setNextMeetingDate(date)
    router.push('/create/secret')
  }

  const handleSkip = () => {
    setNextMeetingDate('')
    router.push('/create/secret')
  }

  const daysUntil = date ? calcDaysUntil(date) : null
  const today     = new Date().toISOString().split('T')[0]

  return (
    <StepLayout
      title="次に会える日は、決まっていますか？"
      subtitle={`まだ決まっていなくても大丈夫です。\n決まったら、いつでも作品に添えられます。`}
      back="/create/anniversary"
    >
      <div className="flex flex-col gap-8">
        {/* Date input */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] tracking-[2px] text-[#888] uppercase">
            次に会える日
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={today}
            className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 text-[18px] font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]/50 transition-colors"
          />
        </div>

        {/* Preview countdown */}
        {date && daysUntil !== null && (
          <div className="text-center py-6 border-t border-[#1A1A1A]/6">
            <div className="text-[11px] tracking-[3px] text-[#888] uppercase mb-2">Until We Meet</div>
            <div
              className="font-display font-semibold text-[#1A1A1A]"
              style={{ fontSize: 'clamp(48px, 15vw, 72px)', lineHeight: 1 }}
            >
              D-{daysUntil}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          <PrimaryButton onClick={handleAdd} disabled={!date}>
            会う日を約束に添える
          </PrimaryButton>
          <PrimaryButton onClick={handleSkip} variant="ghost">
            今は添えない
          </PrimaryButton>
        </div>
      </div>
    </StepLayout>
  )
}
