import {
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'

export type AuthProvider = 'anonymous' | 'google'

/** 未ログインなら匿名ログインして uid を返す。既ログインはそのまま uid を返す。 */
export async function ensureAnonymousAuth(): Promise<string> {
  if (auth.currentUser) return auth.currentUser.uid
  const cred = await signInAnonymously(auth)
  return cred.user.uid
}

/**
 * Googleログイン。
 * - 匿名ユーザー → linkWithPopup でアカウント統合（uid は変わらない）
 * - 既にGoogle認証済み → signInWithPopup
 * - linkWithPopup で credential-already-in-use → signInWithPopup にフォールバック
 */
export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider()
  const current  = auth.currentUser

  if (current?.isAnonymous) {
    try {
      await linkWithPopup(current, provider)
    } catch (err: unknown) {
      // そのGoogleアカウントが別ユーザーに既に紐づいている場合、通常ログインへ
      const code = (err as { code?: string }).code
      if (code === 'auth/credential-already-in-use' || code === 'auth/email-already-in-use') {
        await signInWithPopup(auth, provider)
        return
      }
      throw err
    }
  } else {
    await signInWithPopup(auth, provider)
  }
}

/** 現在のユーザーのプロバイダを返す */
export function getAuthProvider(user: User | null): AuthProvider | null {
  if (!user) return null
  return user.isAnonymous ? 'anonymous' : 'google'
}
