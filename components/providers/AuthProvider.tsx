'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { ensureAnonymousAuth, type AuthProvider } from '@/lib/auth'

interface AuthContextValue {
  user:       User | null
  loading:    boolean
  provider:   AuthProvider | null
}

const AuthContext = createContext<AuthContextValue>({
  user:    null,
  loading: true,
  provider: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        setLoading(false)
      } else {
        // 未ログインの場合、匿名ログインを自動実行
        // 成功すれば onAuthStateChanged が再度 fire して user がセットされる
        try {
          await ensureAnonymousAuth()
        } catch {
          // 匿名ログイン失敗（ネットワークエラーなど）: loading を解除してUIを表示
          setLoading(false)
        }
      }
    })
    return unsub
  }, [])

  const provider: AuthProvider | null = user
    ? (user.isAnonymous ? 'anonymous' : 'google')
    : null

  return (
    <AuthContext.Provider value={{ user, loading, provider }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
