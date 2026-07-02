export const LIMITS = {
  IMAGE_MAX_SIZE_BYTES: 5 * 1024 * 1024,           // 5 MB
  IMAGE_ALLOWED_TYPES:  ['image/jpeg', 'image/png', 'image/webp'] as const,
  MESSAGE_MAX_LENGTH:   1000,
  SECRET_CODE_PATTERN:  /^\d{4}$/,
} as const

export type ImageValidationError =
  | 'INVALID_TYPE'
  | 'TOO_LARGE'

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateImage(file: File): ValidationResult {
  if (!(LIMITS.IMAGE_ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return { ok: false, message: 'JPEG・PNG・WebP形式の写真を選んでください。' }
  }
  if (file.size > LIMITS.IMAGE_MAX_SIZE_BYTES) {
    return { ok: false, message: '写真のサイズは5MB以内にしてください。' }
  }
  return { ok: true }
}

export function validateMessage(message: string): ValidationResult {
  if (message.length > LIMITS.MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      message: `想いは${LIMITS.MESSAGE_MAX_LENGTH}文字以内でお願いします。（現在 ${message.length} 文字）`,
    }
  }
  return { ok: true }
}

export function validateSecretCode(code: string): ValidationResult {
  if (!LIMITS.SECRET_CODE_PATTERN.test(code)) {
    return { ok: false, message: '合言葉は4桁の数字にしてください。' }
  }
  return { ok: true }
}

/** Storage/Firestore に渡す前のファイル名を安全な名前に変換する */
export function safeFileName(file: File): string {
  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safe = (['jpeg','png','webp'] as const).includes(ext as 'jpeg'|'png'|'webp') ? ext : 'jpg'
  return `photo_${Date.now()}.${safe}`
}
