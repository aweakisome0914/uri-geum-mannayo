/** Browser-side: SHA-256( code + ":" + pageId ) */
export async function hashCode(code: string, pageId: string): Promise<string> {
  const data = new TextEncoder().encode(`${code}:${pageId}`)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
