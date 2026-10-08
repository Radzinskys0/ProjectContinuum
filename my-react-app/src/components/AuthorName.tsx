import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../auth/AuthContext'
import TimeoutControls, { isTimedOut, type UserRow } from './TimeoutControls'

// For GMs the name is clickable and opens timeout controls; everyone else just sees the name.
export default function AuthorName({ userId, name }: { userId: string; name: string }) {
  const { role, session } = useAuth()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<UserRow | null>(null)
  const [error, setError] = useState('')

  if (role !== 'gm' || session?.user.id === userId) return <>{name}</>

  const load = async () => {
    const { data, error } = await supabase.rpc('list_users_for_gm')
    if (error) setError(error.message)
    else setUser(((data ?? []) as UserRow[]).find((u) => u.id === userId) ?? null)
  }

  const toggle = () => {
    if (!open) load()
    setOpen(!open)
  }

  return (
    <>
      <button className="author-link" onClick={toggle}>
        {name}
      </button>
      {open && (
        <span className="author-panel">
          {error && <span>{error}</span>}
          {user?.is_gm && <span>GMs cannot be timed out.</span>}
          {user && !user.is_gm && (
            <>
              {isTimedOut(user) && <span>Timed out until {new Date(user.timeout_until!).toLocaleString()}</span>}
              <TimeoutControls user={user} onChanged={load} />
            </>
          )}
        </span>
      )}
    </>
  )
}
