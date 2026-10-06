import { useNavigate } from 'react-router-dom'
import AuthPanel from '../components/AuthPanel'
import { useAuth } from '../auth/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { role, session } = useAuth()

  return (
    <div>
      <h1>Project Continuum</h1>
      <button onClick={() => navigate('/data')}>Go to data</button>
      <button onClick={() => navigate('/forum')}>Go to forum</button>
      {session && <button onClick={() => navigate('/profile')}>Profile</button>}
      {role === 'gm' && <button onClick={() => navigate('/master')}>Go to master</button>}
      <AuthPanel />
    </div>
  )
}
