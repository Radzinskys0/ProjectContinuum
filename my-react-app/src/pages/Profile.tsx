import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { describeTimeout } from '../utils/timeout'
import './Profile.css'

const MIN_LENGTH = 3
const MAX_LENGTH = 24

export default function Profile() {
  const navigate = useNavigate()
  const { session, loading, role, displayName, timedOutUntil, updateDisplayName } = useAuth()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (displayName) setName(displayName)
  }, [displayName])

  if (loading) return null
  if (!session) return <Navigate to="/" replace />

  const trimmed = name.trim()
  const invalid = trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH
  const unchanged = trimmed === displayName

  const save = async () => {
    setSaving(true)
    setMessage('')
    const error = await updateDisplayName(trimmed)
    setMessage(error ?? 'Saved.')
    setSaving(false)
  }

  return (
    <div className="profile">
      <button onClick={() => navigate('/')}>Go back</button>
      <h1>Your profile</h1>
      {timedOutUntil && (
        <p className="profile-timeout">
          You are timed out {describeTimeout(timedOutUntil)} and cannot create threads or reply in the forum.
        </p>
      )}
      <dl>
        <dt>Email</dt>
        <dd>{session.user.email}</dd>
        <dt>Role</dt>
        <dd>{role === 'gm' ? 'GM' : 'Player'}</dd>
      </dl>
      <div className="profile-form">
        <label htmlFor="display-name">Display name</label>
        <input
          id="display-name"
          type="text"
          maxLength={MAX_LENGTH}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setMessage('')
          }}
        />
        <p className="profile-hint">
          {MIN_LENGTH}–{MAX_LENGTH} characters. This is the name shown on your forum posts.
        </p>
        <button onClick={save} disabled={saving || invalid || unchanged}>
          Save
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}
