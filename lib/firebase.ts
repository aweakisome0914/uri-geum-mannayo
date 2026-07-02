import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

// ─── App Check (有効化手順) ────────────────────────────────────────────────
// 1. Firebase Console → App Check → アプリを登録
// 2. Web は reCAPTCHA Enterprise プロバイダを選択
// 3. .env.local に NEXT_PUBLIC_RECAPTCHA_SITE_KEY を追加
// 4. 下記コメントを解除して有効化（開発環境では自動的にスキップ）
//
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
//   initializeAppCheck(app, {
//     provider: new ReCaptchaEnterpriseProvider(
//       process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
//     ),
//     isTokenAutoRefreshEnabled: true,
//   })
// }
// ─────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db      = getFirestore(app)
export const storage = getStorage(app)
export const auth    = getAuth(app)
