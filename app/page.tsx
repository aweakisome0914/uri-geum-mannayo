'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { signInWithGoogle } from '@/lib/auth'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function StartPage() {
  const router  = useRouter()
  const { user, loading, provider } = useAuth()
  const [ready, setReady]     = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError]     = useState('')

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setGoogleError('')
    try {
      await signInWithGoogle()
      // onAuthStateChanged が自動で provider を更新する
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      // popup を閉じた場合は無視
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setGoogleError('Googleログインに失敗しました。もう一度お試しください。')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:     'linear-gradient(160deg, #FAFAF5 0%, #F5EDED 30%, #EDE8F8 65%, #F5F0E8 100%)',
        backgroundSize: '300% 300%',
        animation:      'bgDrift 20s ease infinite',
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[
          { top: '12%', left: '8%',  size: 90, delay: '0s',   dur: '28s', text: '♡' },
          { top: '70%', left: '82%', size: 70, delay: '-10s', dur: '24s', text: '✦' },
          { top: '35%', left: '88%', size: 55, delay: '-5s',  dur: '32s', text: '♡' },
          { top: '80%', left: '12%', size: 80, delay: '-15s', dur: '26s', text: '✦' },
          { top: '22%', left: '78%', size: 60, delay: '-8s',  dur: '30s', text: '♡' },
        ].map((el, i) => (
          <div
            key={i}
            className="absolute font-display select-none"
            style={{
              top:       el.top,
              left:      el.left,
              fontSize:  `${el.size}px`,
              color:     'rgba(200,165,181,0.08)',
              animation: `bgDrift ${el.dur} ease infinite`,
              animationDelay: el.delay,
            }}
          >
            {el.text}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center gap-10 text-center max-w-sm w-full transition-all duration-700"
        style={{ opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)' }}
      >
        {/* Title */}
        <div className="flex flex-col gap-5">
          <h1 className="font-serif text-[30px] font-medium text-[#1A1A1A] leading-[1.55]">
            大切な人へ、<br />想いを形にしましょう。
          </h1>
          <p
            className="text-[13px] text-[#888] leading-[1.8] tracking-wide transition-opacity duration-700"
            style={{ transitionDelay: '200ms', opacity: ready ? 1 : 0 }}
          >
            写真と言葉と、二人だけの記憶で<br />世界にひとつだけの作品をつくります。
          </p>
        </div>

        {/* CTA */}
        <div
          className="w-full flex flex-col gap-4 transition-all duration-700"
          style={{ transitionDelay: '350ms', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <button
            onClick={() => router.push('/create/memory')}
            className="w-full py-4 bg-[#1A1A1A] text-white rounded-full font-serif font-medium text-[15px] tracking-wide active:scale-[0.97] transition-transform duration-150"
          >
            作品をつくりはじめる
          </button>
        </div>

        {/* Auth status */}
        <div
          className="flex flex-col items-center gap-3 transition-opacity duration-700"
          style={{ transitionDelay: '500ms', opacity: ready && !loading ? 1 : 0 }}
        >
          {provider === 'anonymous' && (
            <>
              <p className="text-[11px] text-[#CCC] tracking-wide">ゲスト利用中</p>
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1A1A1A]/10 text-[12px] text-[#888] hover:text-[#1A1A1A] hover:border-[#1A1A1A]/20 transition-colors disabled:opacity-50"
              >
                <GoogleIcon />
                {googleLoading ? '接続中…' : 'Googleでログイン'}
              </button>
              {googleError && (
                <p className="text-[11px] text-red-400">{googleError}</p>
              )}
            </>
          )}

          {provider === 'google' && (
            <div className="flex flex-col items-center gap-1">
              <p className="text-[11px] text-[#48A778] tracking-wide">
                ✓ Googleで保存済み
              </p>
              {user?.email && (
                <p className="text-[10px] text-[#BBB]">{user.email}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
