'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { ensureAnonymousAuth } from '@/lib/auth'
import { auth } from '@/lib/firebase'
import { hashCode } from '@/lib/hash'
import { validateMessage, validateSecretCode, safeFileName } from '@/lib/validation'
import { calcTogetherDays, calcDaysUntil } from '@/lib/days'
import { useCreateStore } from '@/store/createStore'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

const MOOD_THEMES = {
  gentle:   { bg: '#FAFAF5', text: '#1A1A1A', muted: '#888', card: 'rgba(255,255,255,0.8)', accent: '#C8A5B5' },
  romantic: { bg: '#1C1018', text: '#F5EFE8', muted: '#A08890', card: 'rgba(255,255,255,0.06)', accent: '#C8956A' },
  warm:     { bg: '#FAF0E8', text: '#2A1A0A', muted: '#907060', card: 'rgba(255,255,255,0.7)', accent: '#C87058' },
}

export default function PreviewPage() {
  const router = useRouter()
  const {
    message, anniversaryDate, nextMeetingDate,
    mood, secretCode, memoryImageFile, memoryImagePreviewUrl, reset,
  } = useCreateStore()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const theme        = MOOD_THEMES[mood ?? 'gentle']
  const togetherDays = anniversaryDate ? calcTogetherDays(anniversaryDate) : 0
  const daysUntil    = nextMeetingDate ? calcDaysUntil(nextMeetingDate) : null

  const handleDeliver = async () => {
    // ── クライアントバリデーション ──────────────────────────────────────
    if (!memoryImageFile) {
      setError('思い出の写真を選んでください。')
      return
    }
    const msgResult = validateMessage(message)
    if (!msgResult.ok) { setError(msgResult.message); return }

    const codeResult = validateSecretCode(secretCode)
    if (!codeResult.ok) { setError(codeResult.message); return }

    if (!anniversaryDate) {
      setError('二人が始まった日を選んでください。')
      return
    }
    if (!mood) {
      setError('世界観を選んでください。')
      return
    }

    setLoading(true)
    setError('')

    try {
      // ── 1. 匿名ログイン（未ログインなら自動で実行）──────────────────
      let uid: string
      try {
        uid = await ensureAnonymousAuth()
      } catch {
        setError('ネットワークに接続できませんでした。もう一度試してください。')
        setLoading(false)
        return
      }

      // ── 2. pageId 生成・コードハッシュ化・プロバイダ取得 ───────────
      const pageId            = crypto.randomUUID()
      const secretCodeHash    = await hashCode(secretCode, pageId)
      const createdByProvider = auth.currentUser?.isAnonymous ? 'anonymous' : 'google'

      // ── 3. Storage へ画像アップロード（パス: memories/{uid}/{pageId}/）
      const filename   = safeFileName(memoryImageFile)
      const storageRef = ref(storage, `memories/${uid}/${pageId}/${filename}`)

      let imageUrl: string
      try {
        await uploadBytes(storageRef, memoryImageFile)
        imageUrl = await getDownloadURL(storageRef)
      } catch {
        setError('写真の保存に失敗しました。もう一度試してください。')
        setLoading(false)
        return
      }

      // ── 4. Firestore へ保存 ───────────────────────────────────────
      try {
        await setDoc(doc(db, 'pages', pageId), {
          ownerUid:           uid,
          createdByProvider,
          imageUrls:          [imageUrl],
          imageCount:      1,
          message,
          anniversaryDate,
          nextMeetingDate: nextMeetingDate || null,
          mood,
          secretCodeHash,
          createdAt:       serverTimestamp(),
        })
      } catch {
        setError('作品の保存に失敗しました。もう一度試してください。')
        setLoading(false)
        return
      }

      reset()
      router.push(`/share/${pageId}`)

    } catch (e) {
      console.error(e)
      setError('予期しないエラーが起きました。もう一度試してください。')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-0">
        <a
          href="/create/mood"
          className="text-sm tracking-wide transition-colors"
          style={{ color: theme.muted }}
        >
          ← 作品を直す
        </a>
      </div>

      <div className="px-6 pt-8 pb-4 max-w-md mx-auto w-full">
        <p className="text-[11px] tracking-[3px] uppercase mb-2" style={{ color: theme.muted }}>
          あなたの作品
        </p>
        <h1 className="font-serif text-[22px] font-medium leading-relaxed">
          大切な人に届く前に、<br />一度だけ確かめてみてください。
        </h1>
      </div>

      {/* Preview — mirrors the gift page */}
      <div className="flex-1 px-6 pb-6 max-w-md mx-auto w-full flex flex-col gap-5">

        {/* Photo */}
        {memoryImagePreviewUrl && (
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memoryImagePreviewUrl}
              alt="思い出"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="rounded-2xl p-6 relative" style={{ background: theme.card }}>
            <div
              className="absolute top-3 left-5 font-display text-[60px] leading-none pointer-events-none select-none"
              style={{ color: `${theme.accent}22` }}
            >
              "
            </div>
            <p
              className="font-serif text-[15px] leading-[1.9] relative z-10 pt-4 whitespace-pre-wrap"
              style={{ color: theme.text }}
            >
              {message}
            </p>
          </div>
        )}

        {/* Together Days */}
        {anniversaryDate && (
          <div className="rounded-2xl p-6 text-center" style={{ background: theme.card }}>
            <div className="text-[11px] tracking-[3px] uppercase mb-1" style={{ color: theme.muted }}>
              Together
            </div>
            <div
              className="font-display font-semibold"
              style={{ fontSize: 'clamp(52px, 16vw, 72px)', lineHeight: 1, color: theme.text }}
            >
              {togetherDays.toLocaleString()}
            </div>
            <div className="text-[11px] tracking-[3px] uppercase mt-2" style={{ color: theme.muted }}>
              Days
            </div>
          </div>
        )}

        {/* Next Meeting */}
        {nextMeetingDate && daysUntil !== null && (
          <div className="rounded-2xl p-6 text-center" style={{ background: theme.card }}>
            <div className="text-[11px] tracking-[3px] uppercase mb-1" style={{ color: theme.muted }}>
              Until We Meet
            </div>
            <div
              className="font-display font-semibold"
              style={{ fontSize: 'clamp(44px, 14vw, 64px)', lineHeight: 1, color: theme.text }}
            >
              D-{daysUntil}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-12 max-w-md mx-auto w-full">
        {error && (
          <p className="text-red-400 text-[13px] text-center mb-4 leading-relaxed">{error}</p>
        )}
        <PrimaryButton onClick={handleDeliver} loading={loading}>
          この作品を届ける
        </PrimaryButton>
      </div>
    </div>
  )
}
