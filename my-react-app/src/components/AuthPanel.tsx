import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../auth/AuthContext'

export default function AuthPanel() {
  const { session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async () => {
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
    } else if (!data.session) {
      setMessage('Check your email to confirm your account, then log in.')
    }
    setLoading(false)
  }

  const logIn = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  const logOut = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={logOut}>Log out</button>
      </div>
    )
  }

  return (
    <div>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUp} disabled={loading}>Sign up</button>
      <button onClick={logIn} disabled={loading}>Log in</button>
      {message && <p>{message}</p>}
    </div>
  )
}
