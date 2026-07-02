'use client'

import { useEffect, useRef, useState } from 'react'
import type { LovePage } from '@/types'
import { calcTogetherDays, calcDaysUntil } from '@/lib/days'

const MOOD_THEMES = {
  gentle: {
    bg:      '#FAFAF5',
    text:    '#1A1A1A',
    muted:   '#888888',
    card:    'rgba(255,255,255,0.80)',
    accent:  '#C8A5B5',
    shadow:  'rgba(200,165,181,0.15)',
  },
  romantic: {
    bg:      '#1C1018',
    text:    '#F5EFE8',
    muted:   '#A08890',
    card:    'rgba(255,255,255,0.06)',
    accent:  '#C8956A',
    shadow:  'rgba(200,149,106,0.15)',
  },
  warm: {
    bg:      '#FAF0E8',
    text:    '#2A1A0A',
    muted:   '#907060',
    card:    'rgba(255,255,255,0.70)',
    accent:  '#C87058',
    shadow:  'rgba(200,112,88,0.15)',
  },
}

function useCountUp(target: number, enabled: boolean, delay = 0) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || target === 0) return
    const timer = setTimeout(() => {
      const duration = 1600
      const start    = performance.now()
      const tick = (now: number) => {
        const elapsed  = Math.min(now - start, duration)
        const progress = elapsed / duration
        const eased    = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.floor(eased * target))
        if (elapsed < duration) rafRef.current = requestAnimationFrame(tick)
        else setDisplay(target)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, enabled, delay])

  return display
}

interface Props {
  page:    LovePage
  visible: boolean
}

export function GiftContent({ page, visible }: Props) {
  const theme       = MOOD_THEMES[page.mood]
  const togetherDays = calcTogetherDays(page.anniversaryDate)
  const daysUntil    = page.nextMeetingDate ? calcDaysUntil(page.nextMeetingDate) : null
  const displayDays  = useCountUp(togetherDays, visible, 1800)
  const displayUntil = useCountUp(daysUntil ?? 0, visible && !!daysUntil, 2400)

  return (
    <div
      className="min-h-screen flex flex-col transition-opacity duration-1000"
      style={{
        background:  theme.bg,
        color:       theme.text,
        opacity:     visible ? 1 : 0,
      }}
    >
      {/* Photo — full bleed, top half */}
      {page.imageUrls?.[0] && (
        <div
          className="relative w-full transition-opacity duration-700"
          style={{ aspectRatio: '4/3', opacity: visible ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.imageUrls[0]}
            alt="思い出"
            className="w-full h-full object-cover"
          />
          {/* Vignette bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent 60%, ${theme.bg})` }}
          />
        </div>
      )}

      {/* Cards */}
      <div className="px-5 pb-20 flex flex-col gap-5 -mt-4 relative z-10">

        {/* Message */}
        <div
          className="rounded-3xl p-7 relative transition-all duration-700"
          style={{
            background:  theme.card,
            boxShadow:   `0 8px 40px ${theme.shadow}`,
            transitionDelay: visible ? '600ms' : '0ms',
            opacity:     visible ? 1 : 0,
            transform:   visible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <div
            className="absolute top-4 left-6 font-display text-[64px] leading-none pointer-events-none select-none"
            style={{ color: `${theme.accent}20` }}
          >
            "
          </div>
          <p
            className="font-serif text-[15px] leading-[1.95] pt-5 whitespace-pre-wrap"
            style={{ color: theme.text }}
          >
            {page.message}
          </p>
        </div>

        {/* Together Days */}
        <div
          className="rounded-3xl p-7 text-center transition-all duration-700"
          style={{
            background:      theme.card,
            boxShadow:       `0 8px 40px ${theme.shadow}`,
            transitionDelay: visible ? '1200ms' : '0ms',
            opacity:         visible ? 1 : 0,
            transform:       visible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <div
            className="text-[10px] tracking-[4px] uppercase mb-2"
            style={{ color: theme.muted }}
          >
            Together
          </div>
          <div
            className="font-display font-semibold"
            style={{
              fontSize:   'clamp(56px, 17vw, 80px)',
              lineHeight: 1,
              color:      theme.text,
            }}
          >
            {displayDays.toLocaleString()}
          </div>
          <div
            className="text-[10px] tracking-[4px] uppercase mt-3"
            style={{ color: theme.muted }}
          >
            Days
          </div>
        </div>

        {/* Next Meeting — only when set */}
        {daysUntil !== null && (
          <div
            className="rounded-3xl p-7 text-center transition-all duration-700"
            style={{
              background:      theme.card,
              boxShadow:       `0 8px 40px ${theme.shadow}`,
              transitionDelay: visible ? '1800ms' : '0ms',
              opacity:         visible ? 1 : 0,
              transform:       visible ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <div
              className="text-[10px] tracking-[4px] uppercase mb-2"
              style={{ color: theme.muted }}
            >
              Until We Meet
            </div>
            <div
              className="font-display font-semibold"
              style={{
                fontSize:   'clamp(48px, 15vw, 68px)',
                lineHeight: 1,
                color:      theme.text,
              }}
            >
              D-{displayUntil}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
