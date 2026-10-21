import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuth } from '../auth/AuthContext'
import './AuthButton.css'

export default function AuthButton() {
  const { session, loading, displayName } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) return <div className="auth-bar" />

  return (
    <div className="auth-bar">
      {session ? (
        <>
          <span>Signed in as {displayName ?? session.user.email}</span>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={() => supabase.auth.signOut()}>Log out</button>
        </>
      ) : (
        <button onClick={() => navigate('/login', { state: { from: location.pathname } })}>
          Log in / Sign up
        </button>
      )}
    </div>
  )
}
