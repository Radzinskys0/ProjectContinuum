import { useState } from 'react'
import { supabase } from '../utils/supabase'
import './TimeoutControls.css'

export type UserRow = {
  id: string
  display_name: string
  is_gm: boolean
  timeout_until: string | null
}

const DURATIONS = [
  { label: '1 hour', hours: 1 },
  { label: '1 day', hours: 24 },
  { label: '7 days', hours: 24 * 7 },
  { label: '30 days', hours: 24 * 30 },
]

export const isTimedOut = (u: UserRow) => !!u.timeout_until && new Date(u.timeout_until) > new Date()

export default function TimeoutControls({ user, onChanged }: { user: UserRow; onChanged: () => void }) {
  const [hours, setHours] = useState(DURATIONS[0].hours)
  const [error, setError] = useState('')

  const setTimeoutUntil = async (until: Date | null) => {
    setError('')
    const { error } = await supabase.rpc('timeout_user', {
      p_user_id: user.id,
      p_until: until ? until.toISOString() : null,
    })
    if (error) setError(error.message)
    else onChanged()
  }

  if (user.is_gm) return null

  return (
    <div className="timeout-controls">
      <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
        {DURATIONS.map((d) => (
          <option key={d.hours} value={d.hours}>
            {d.label}
          </option>
        ))}
      </select>
      <button onClick={() => setTimeoutUntil(new Date(Date.now() + hours * 60 * 60 * 1000))}>
        {isTimedOut(user) ? 'Change timeout' : 'Timeout'}
      </button>
      {isTimedOut(user) && <button onClick={() => setTimeoutUntil(null)}>Lift timeout</button>}
      {error && <span>{error}</span>}
    </div>
  )
}
