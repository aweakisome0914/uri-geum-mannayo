'use client'

import { useRef, KeyboardEvent, ClipboardEvent } from 'react'

interface Props {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  error?: boolean
}

export function PinInput({ value, onChange, disabled, error }: Props) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits && raw !== '') return

    // Handle paste of multiple digits
    if (digits.length > 1) {
      const next = ['', '', '', '']
      for (let i = 0; i < 4; i++) next[i] = digits[i] || ''
      onChange(next)
      const focus = Math.min(digits.length, 3)
      refs[focus].current?.focus()
      return
    }

    const next = [...value]
    next[index] = digits
    onChange(next)

    if (digits && index < 3) {
      refs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const next = [...value]
        next[index] = ''
        onChange(next)
      } else if (index > 0) {
        refs[index - 1].current?.focus()
        const next = [...value]
        next[index - 1] = ''
        onChange(next)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) refs[index - 1].current?.focus()
    if (e.key === 'ArrowRight' && index < 3) refs[index + 1].current?.focus()
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!digits) return
    const next = ['', '', '', '']
    for (let i = 0; i < 4; i++) next[i] = digits[i] || ''
    onChange(next)
    const focus = Math.min(digits.length, 3)
    refs[focus].current?.focus()
  }

  const borderColor = error
    ? 'border-red-400 focus:border-red-500'
    : 'border-[#1A1A1A]/25 focus:border-[#1A1A1A]'

  return (
    <div className="flex gap-4 justify-center">
      {[0, 1, 2, 3].map(i => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-14 h-16 text-center text-[28px] font-display bg-transparent border-b-2 ${borderColor} focus:outline-none transition-colors duration-200 caret-transparent`}
          aria-label={`合言葉 ${i + 1}桁目`}
        />
      ))}
    </div>
  )
}
