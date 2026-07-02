import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { GiftGate } from '@/components/gift/GiftGate'

interface Props {
  params: Promise<{ id: string }>
}

async function getBaseUrl(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  return `${proto}://${host}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const base = await getBaseUrl()

  const title       = 'あなたへの贈り物 | Love Page'
  const description = 'あなたへの想いが届いています。合言葉を入れて、開けてください。'
  const ogImage     = `${base}/og/${id}`
  const canonical   = `${base}/p/${id}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Love Page',
      locale: 'ja_JP',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'あなたへの贈り物',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function GiftPage({ params }: Props) {
  const { id } = await params
  return <GiftGate pageId={id} />
}
