import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuth } from '../auth/AuthContext'
import './Login.css'

export default function Login() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const from = typeof location.state?.from === 'string' && location.state.from.startsWith('/') ? location.state.from : '/'

  if (session) return <Navigate to={from} replace />

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

  return (
    <div className="login">
      <button onClick={() => navigate(from)}>Go back</button>
      <h1>Log in / Sign up</h1>
      <div className="login-form">
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
        <div className="login-buttons">
          <button onClick={signUp} disabled={loading}>Sign up</button>
          <button onClick={logIn} disabled={loading}>Log in</button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}
