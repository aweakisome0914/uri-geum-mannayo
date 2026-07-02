'use client'

import { useState } from 'react'
import { use } from 'react'

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${id}`
    : `/p/${id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{
        background: 'linear-gradient(160deg, #FAFAF5 0%, #F5F0ED 50%, #F8F5F0 100%)',
      }}
    >
      <div className="max-w-sm w-full flex flex-col items-center gap-10">

        {/* Completion mark */}
        <div
          className="w-20 h-20 rounded-[24px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #FDE8F0, #EDE8F8)',
            boxShadow: '0 8px 32px rgba(200,165,181,0.25)',
          }}
        >
          <span className="text-4xl">✉</span>
        </div>

        {/* Copy text */}
        <div className="text-center flex flex-col gap-3">
          <h1 className="font-serif text-[24px] font-medium text-[#1A1A1A] leading-relaxed">
            あなたの想いが、<br />一つの作品になりました。
          </h1>
          <p className="text-[13px] text-[#888] leading-[1.8]">
            このリンクを送るだけで、<br />大切な人に作品を届けられます。
          </p>
        </div>

        {/* URL display */}
        <div
          className="w-full rounded-2xl px-5 py-4"
          style={{ background: 'rgba(255,255,255,0.8)' }}
        >
          <p className="text-[12px] text-[#888] tracking-widest mb-1 uppercase">招待リンク</p>
          <p
            className="text-[13px] text-[#1A1A1A] break-all"
            style={{ wordBreak: 'break-all' }}
          >
            {url}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-full py-4 rounded-full font-serif font-medium text-[15px] tracking-wide transition-all duration-300 active:scale-[0.97]"
          style={{
            background: copied ? 'rgba(72,167,120,0.15)' : '#1A1A1A',
            color: copied ? '#48A778' : 'white',
            border: copied ? '1.5px solid rgba(72,167,120,0.4)' : 'none',
          }}
        >
          {copied ? '✓ 届ける準備ができました' : 'リンクをコピーする'}
        </button>

        {/* Footer */}
        <p className="text-center text-[11.5px] text-[#BBB] leading-[1.8] tracking-wide">
          通知ではなく、あなたの手で届ける。<br />
          そのひと手間も、作品の一部です。
        </p>

        {/* New creation link */}
        <a
          href="/"
          className="text-[12px] text-[#888] hover:text-[#1A1A1A] transition-colors tracking-wide"
        >
          新しい作品をつくる
        </a>
      </div>
    </div>
  )
}
