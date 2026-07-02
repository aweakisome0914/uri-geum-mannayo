'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { SecretCodeEntry } from './SecretCodeEntry'
import { GiftContent } from './GiftContent'
import type { LovePage } from '@/types'

interface Props {
  pageId: string
}

type GateState = 'loading' | 'locked' | 'welcome' | 'open' | 'not-found' | 'error'

const STORAGE_KEY = (id: string) => `love_unlocked_${id}`

export function GiftGate({ pageId }: Props) {
  const [gateState, setGateState] = useState<GateState>('loading')
  const [page, setPage]           = useState<LovePage | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pageDoc = await getDoc(doc(db, 'pages', pageId))
        if (!pageDoc.exists()) {
          setGateState('not-found')
          return
        }
        // 旧フォーマット(memoryImageUrl)と新フォーマット(imageUrls)の両方に対応
        const raw = pageDoc.data()!
        const data: LovePage = {
          id:              pageId,
          ownerUid:        raw.ownerUid        ?? '',
          imageUrls:       raw.imageUrls       ?? (raw.memoryImageUrl ? [raw.memoryImageUrl] : []),
          imageCount:      raw.imageCount      ?? 1,
          message:         raw.message         ?? '',
          anniversaryDate: raw.anniversaryDate ?? '',
          nextMeetingDate: raw.nextMeetingDate  ?? null,
          mood:            raw.mood             ?? 'gentle',
          secretCodeHash:  raw.secretCodeHash   ?? '',
        }
        setPage(data)

        // Check sessionStorage for unlock state
        const unlocked = sessionStorage.getItem(STORAGE_KEY(pageId))
        setGateState(unlocked === '1' ? 'open' : 'locked')
      } catch {
        setGateState('error')
      }
    }

    fetchPage()
  }, [pageId])

  const handleUnlock = () => {
    sessionStorage.setItem(STORAGE_KEY(pageId), '1')
    setGateState('welcome')

    // Show "welcome" message briefly, then reveal the gift
    setTimeout(() => setGateState('open'), 2200)
  }

  if (gateState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
        <p className="text-[13px] text-[#888] animate-pulse tracking-wide">…</p>
      </div>
    )
  }

  if (gateState === 'not-found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#FAFAF5]">
        <p className="font-serif text-[18px] text-[#888] text-center leading-relaxed">
          この作品は見つかりませんでした。
        </p>
      </div>
    )
  }

  if (gateState === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#FAFAF5]">
        <p className="font-serif text-[18px] text-[#888] text-center leading-relaxed">
          もう一度試してみてください。
        </p>
      </div>
    )
  }

  if (gateState === 'locked') {
    return <SecretCodeEntry pageId={pageId} onUnlock={handleUnlock} />
  }

  if (gateState === 'welcome') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}
      >
        <div className="text-center flex flex-col items-center gap-6 animate-fade-up">
          <div className="text-5xl">💕</div>
          <div className="font-serif text-[20px] text-[#C8A5B5] font-medium">
            ようこそ。
          </div>
          <p className="text-[13px] text-[#888] leading-[1.8]">
            あなたへの想いが届いています。
          </p>
        </div>
      </div>
    )
  }

  // gateState === 'open'
  return page ? (
    <GiftContent page={page} visible={gateState === 'open'} />
  ) : null
}
