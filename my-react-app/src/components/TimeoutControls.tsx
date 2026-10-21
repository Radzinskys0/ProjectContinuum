import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { INDEFINITE_TIMEOUT } from '../utils/timeout'
import './TimeoutControls.css'

export type UserRow = {
  id: string
  display_name: string
  is_gm: boolean
  timeout_until: string | null
}

const DURATIONS = [
  { id: '1h', label: '1 hour', hours: 1 },
  { id: '1d', label: '1 day', hours: 24 },
  { id: '7d', label: '7 days', hours: 24 * 7 },
  { id: '30d', label: '30 days', hours: 24 * 30 },
  { id: 'forever', label: 'Indefinite', hours: null },
]

export const isTimedOut = (u: UserRow) => !!u.timeout_until && new Date(u.timeout_until) > new Date()

export default function TimeoutControls({ user, onChanged }: { user: UserRow; onChanged: () => void }) {
  const [durationId, setDurationId] = useState(DURATIONS[0].id)
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

  const apply = () => {
    const { hours } = DURATIONS.find((d) => d.id === durationId)!
    setTimeoutUntil(hours === null ? INDEFINITE_TIMEOUT : new Date(Date.now() + hours * 60 * 60 * 1000))
  }

  if (user.is_gm) return null

  return (
    <div className="timeout-controls">
      <select value={durationId} onChange={(e) => setDurationId(e.target.value)}>
        {DURATIONS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </select>
      <button onClick={apply}>{isTimedOut(user) ? 'Change timeout' : 'Timeout'}</button>
      {isTimedOut(user) && <button onClick={() => setTimeoutUntil(null)}>Lift timeout</button>}
      {error && <span>{error}</span>}
    </div>
  )
}
