import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

type AuthState = {
  session: Session | null
  loading: boolean
  role: string | null
  displayName: string | null
  timedOutUntil: Date | null
  updateDisplayName: (name: string) => Promise<string | null>
}

const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  role: null,
  displayName: null,
  timedOutUntil: null,
  updateDisplayName: async () => 'Not logged in.',
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [timeoutUntil, setTimeoutUntil] = useState<string | null>(null)

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

  const userId = session?.user.id

  useEffect(() => {
    if (!userId) {
      setDisplayName(null)
      setTimeoutUntil(null)
      return
    }
    let cancelled = false
    supabase
      .from('profiles')
      .select('display_name, timeout_until')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setDisplayName(data?.display_name ?? null)
        setTimeoutUntil(data?.timeout_until ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const updateDisplayName = useCallback(
    async (name: string) => {
      if (!userId) return 'Not logged in.'
      const { data, error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', userId)
        .select('display_name')
      if (error) return error.code === '23505' ? 'That name is already taken.' : error.message
      if (!data || data.length === 0) return 'Could not update your profile.'
      setDisplayName(data[0].display_name)
      return null
    },
    [userId],
  )

  const timedOutUntil = timeoutUntil && new Date(timeoutUntil) > new Date() ? new Date(timeoutUntil) : null
  const role = (session?.user.app_metadata?.role as string | undefined) ?? null

  return (
    <AuthContext.Provider value={{ session, loading, role, displayName, timedOutUntil, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
