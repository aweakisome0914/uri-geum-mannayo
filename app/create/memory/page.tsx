'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepLayout } from '@/components/create/StepLayout'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { useCreateStore } from '@/store/createStore'
import { validateImage } from '@/lib/validation'

export default function MemoryPage() {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const { memoryImagePreviewUrl, setMemoryImage } = useCreateStore()
  const [preview, setPreview] = useState(memoryImagePreviewUrl)
  const [error, setError]     = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = validateImage(file)
    if (!result.ok) {
      setError(result.message)
      e.target.value = ''
      return
    }

    setError('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    setMemoryImage(file, url)
  }

  return (
    <StepLayout
      title="二人の思い出を、ひとつ選んでください。"
      subtitle="一番届けたい瞬間は、どの写真ですか？"
      back="/"
    >
      <div className="flex flex-col gap-8">
        {/* Photo area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative cursor-pointer rounded-2xl overflow-hidden"
          style={{ aspectRatio: '4/3' }}
        >
          {preview ? (
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="選んだ思い出"
                className="w-full h-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-white/90 text-xs tracking-widest">
                この思い出
              </div>
            </div>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-4"
              style={{
                background: 'linear-gradient(145deg, #FDE8F0 0%, #EDE8F8 55%, #D8F0E8 100%)',
              }}
            >
              <div className="text-5xl opacity-30">📷</div>
              <p className="text-sm text-[#888] tracking-wide">思い出を選ぶ</p>
            </div>
          )}
        </div>

        {/* Validation error */}
        {error && (
          <p className="text-[13px] text-red-400 text-center -mt-4">{error}</p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />

        {/* Hint */}
        <p className="text-[11px] text-[#CCC] text-center -mt-4 tracking-wide">
          JPEG・PNG・WebP / 5MB以内
        </p>

        {preview ? (
          <PrimaryButton onClick={() => router.push('/create/message')}>
            この思い出を届ける
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => fileRef.current?.click()} variant="ghost">
            写真を選ぶ
          </PrimaryButton>
        )}
      </div>
    </StepLayout>
  )
}
