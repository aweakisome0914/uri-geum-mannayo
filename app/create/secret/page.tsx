'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepLayout } from '@/components/create/StepLayout'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { PinInput } from '@/components/ui/PinInput'
import { useCreateStore } from '@/store/createStore'

export default function SecretPage() {
  const router = useRouter()
  const { setSecretCode } = useCreateStore()
  const [digits, setDigits] = useState(['', '', '', ''])

  const isComplete = digits.every(d => d !== '')

  const handleContinue = () => {
    setSecretCode(digits.join(''))
    router.push('/create/mood')
  }

  return (
    <StepLayout
      title="二人だけの合言葉を決めてください。"
      subtitle={`記念日、誕生日、初めて会った日——\nあなたたちだけが知っている4つの数字で、この作品に鍵をかけます。`}
      back="/create/meeting"
    >
      <div className="flex flex-col gap-16">
        <div className="pt-6">
          <PinInput value={digits} onChange={setDigits} />
        </div>

        <div className="flex flex-col gap-4">
          <PrimaryButton onClick={handleContinue} disabled={!isComplete}>
            この合言葉で鍵をかける
          </PrimaryButton>
          <p className="text-center text-[11px] text-[#BBB] leading-relaxed tracking-wide">
            大切な人だけが知っている数字にしましょう
          </p>
        </div>
      </div>
    </StepLayout>
  )
}
