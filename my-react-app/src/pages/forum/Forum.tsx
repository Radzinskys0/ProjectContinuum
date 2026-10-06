import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import './Forum.css'

type Topic = {
  id: number
  title: string
  description: string | null
}

export default function Forum() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('topics').select('id, title, description').order('id')
      if (error) setError(error.message)
      else setTopics(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="forum">
      <button onClick={() => navigate('/')}>Go back</button>
      <h1>Forum</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Could not load topics: {error}</p>}
      <ul className="forum-list">
        {topics.map((t) => (
          <li key={t.id}>
            <Link to={`/forum/topic/${t.id}`}>{t.title}</Link>
            {t.description && <p>{t.description}</p>}
          </li>
        ))}
      </ul>
      {!loading && !error && topics.length === 0 && <p>No topics yet.</p>}
    </div>
  )
}
