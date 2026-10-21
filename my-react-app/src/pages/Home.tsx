import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { role } = useAuth()

  return (
    <div>
      <h1>Project Continuum</h1>
      <button onClick={() => navigate('/data')}>Go to data</button>
      <button onClick={() => navigate('/forum')}>Go to forum</button>
      {role === 'gm' && <button onClick={() => navigate('/master')}>Go to master</button>}
    </div>
  )
}
