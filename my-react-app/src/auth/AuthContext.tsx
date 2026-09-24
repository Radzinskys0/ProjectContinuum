import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

type AuthState = {
  session: Session | null
  loading: boolean
  role: string | null
}

const AuthContext = createContext<AuthState>({ session: null, loading: true, role: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const role = (session?.user.app_metadata?.role as string | undefined) ?? null

  return <AuthContext.Provider value={{ session, loading, role }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
