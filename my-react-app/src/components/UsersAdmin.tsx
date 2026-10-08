import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../utils/supabase'
import TimeoutControls, { isTimedOut, type UserRow } from './TimeoutControls'
import './UsersAdmin.css'

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc('list_users_for_gm')
    if (error) setError(error.message)
    else setUsers((data ?? []) as UserRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? users.filter((u) => u.display_name.toLowerCase().includes(q)) : users
  }, [users, query])

  if (loading) return <p>Loading...</p>

  return (
    <div className="users-admin">
      <input
        type="search"
        placeholder="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p>{error}</p>}
      <ul className="users-admin-list">
        {filtered.map((u) => (
          <li key={u.id}>
            <div className="users-admin-name">
              <strong>{u.display_name}</strong>
              {u.is_gm && <span className="users-admin-tag">GM</span>}
              {isTimedOut(u) && (
                <span className="users-admin-tag timed-out">
                  Timed out until {new Date(u.timeout_until!).toLocaleString()}
                </span>
              )}
            </div>
            <TimeoutControls user={u} onChanged={load} />
          </li>
        ))}
        {filtered.length === 0 && <li>No matches</li>}
      </ul>
    </div>
  )
}
