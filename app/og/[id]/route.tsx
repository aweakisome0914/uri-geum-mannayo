import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

// Font cached after first load — persists across requests in the same process
let fontData: ArrayBuffer | null = null

function getFont(): ArrayBuffer {
  if (fontData) return fontData
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSerifJP-Regular.ttf')
  const buf = fs.readFileSync(fontPath)
  fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  return fontData as ArrayBuffer
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let photoUrl: string | null = null
  try {
    const snap = await getDoc(doc(db, 'pages', id))
    if (snap.exists()) {
      photoUrl = snap.data().imageUrls?.[0] ?? null
    }
  } catch {
    // render fallback design
  }

  const font = getFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#1C1018',
        }}
      >
        {/* Background photo — full bleed */}
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Vignette — darker at bottom for text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: photoUrl
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.72) 75%, rgba(0,0,0,0.85) 100%)'
              : 'linear-gradient(160deg, #1C1018 0%, #2D1A28 50%, #1A1828 100%)',
            display: 'flex',
          }}
        />

        {/* No-photo decorative accent (SVG to avoid font issues) */}
        {!photoUrl && (
          <svg
            viewBox="0 0 100 90"
            style={{
              position: 'absolute',
              top: '40px',
              right: '56px',
              width: '160px',
              height: '144px',
              opacity: 0.10,
            }}
          >
            <path
              d="M50 85 L10 45 C-5 30 -5 5 15 2 C28 0 42 10 50 22 C58 10 72 0 85 2 C105 5 105 30 90 45 Z"
              fill="rgba(200,165,181,1)"
            />
          </svg>
        )}

        {/* Bottom text block */}
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '72px',
            right: '72px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '1.5px',
                background: 'rgba(200,165,181,0.7)',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: '18px',
                color: 'rgba(200,165,181,0.9)',
                letterSpacing: '5px',
                fontFamily: 'NotoSerifJP',
                display: 'flex',
              }}
            >
              LOVE PAGE
            </span>
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: '58px',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.35,
              fontFamily: 'NotoSerifJP',
              display: 'flex',
            }}
          >
            あなたへの贈り物
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.60)',
              lineHeight: 1.5,
              fontFamily: 'NotoSerifJP',
              display: 'flex',
              marginTop: '4px',
            }}
          >
            合言葉を入れて、開けてください。
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSerifJP',
          data: font,
          weight: 400,
        },
      ],
    },
  )
}
