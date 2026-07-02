'use client'

import Link from 'next/link'

interface Props {
  title:       string
  subtitle?:   string
  children:    React.ReactNode
  back?:       string
  hideBack?:   boolean
}

export function StepLayout({ title, subtitle, children, back, hideBack }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #FAFAF5 0%, #F5F0ED 50%, #F8F5F0 100%)',
        backgroundSize: '200% 200%',
      }}
    >
      {/* Back nav */}
      {!hideBack && back && (
        <div className="px-6 pt-14 pb-0">
          <Link
            href={back}
            className="text-[#888] text-sm tracking-wide hover:text-[#1A1A1A] transition-colors"
          >
            ← 戻る
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-16 pb-10 max-w-md mx-auto w-full">
        <h1 className="font-serif text-[26px] font-medium text-[#1A1A1A] leading-[1.5] mb-4 animate-fade-up">
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-[13px] text-[#888] leading-[1.8] mb-10 animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            {subtitle}
          </p>
        )}
        <div className="flex-1 animate-fade-up" style={{ animationDelay: '140ms' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
