import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import crypto from 'crypto'

// In-memory rate limiting: max 10 attempts per IP per pageId, 5-minute cooldown
const attempts = new Map<string, { count: number; resetAt: number }>()

function serverHash(code: string, id: string): string {
  return crypto.createHash('sha256').update(`${code}:${id}`).digest('hex')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ip  = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
  const key = `${ip}:${id}`
  const now = Date.now()

  const record = attempts.get(key)
  if (record && record.count >= 10 && now < record.resetAt) {
    return NextResponse.json({ valid: false, blocked: true }, { status: 429 })
  }

  let code: string
  try {
    const body = await request.json()
    code = String(body.code ?? '')
  } catch {
    return NextResponse.json({ valid: false })
  }

  if (!/^\d{4}$/.test(code)) {
    return NextResponse.json({ valid: false })
  }

  const pageDoc = await getDoc(doc(db, 'pages', id))
  if (!pageDoc.exists()) {
    return NextResponse.json({ valid: false })
  }

  const hash  = serverHash(code, id)
  const valid = hash === pageDoc.data().secretCodeHash

  if (valid) {
    attempts.delete(key)
  } else {
    const newCount = (record?.count ?? 0) + 1
    attempts.set(key, { count: newCount, resetAt: now + 5 * 60 * 1000 })
  }

  return NextResponse.json({ valid })
}
