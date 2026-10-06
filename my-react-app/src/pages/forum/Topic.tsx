import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../auth/AuthContext'
import './Forum.css'

type ThreadRow = {
  id: number
  title: string
  created_at: string
  author: { display_name: string } | null
}

export default function Topic() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [topicTitle, setTopicTitle] = useState('')
  const [threads, setThreads] = useState<ThreadRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function load() {
      const [topicRes, threadsRes] = await Promise.all([
        supabase.from('topics').select('title').eq('id', topicId).maybeSingle(),
        supabase
          .from('threads')
          .select('id, title, created_at, author:profiles(display_name)')
          .eq('topic_id', topicId)
          .order('created_at', { ascending: false }),
      ])
      if (topicRes.error || threadsRes.error) {
        setError((topicRes.error ?? threadsRes.error)!.message)
      } else if (!topicRes.data) {
        setError('Topic not found.')
      } else {
        setTopicTitle(topicRes.data.title)
        setThreads((threadsRes.data ?? []) as unknown as ThreadRow[])
      }
      setLoading(false)
    }
    load()
  }, [topicId])

  const createThread = async () => {
    setSubmitting(true)
    setFormError('')
    const { data, error } = await supabase.rpc('create_thread', {
      p_topic_id: Number(topicId),
      p_title: title.trim(),
      p_body: body.trim(),
    })
    if (error) {
      setFormError(error.message)
      setSubmitting(false)
    } else {
      navigate(`/forum/thread/${data}`)
    }
  }

  return (
    <div className="forum">
      <button onClick={() => navigate('/forum')}>Go back</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h1>{topicTitle}</h1>

          {session ? (
            <div className="forum-form">
              <h2>New thread</h2>
              <input
                type="text"
                placeholder="Title"
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Write the first post"
                rows={5}
                maxLength={10000}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button onClick={createThread} disabled={submitting || !title.trim() || !body.trim()}>
                Create thread
              </button>
              {formError && <p>{formError}</p>}
            </div>
          ) : (
            <p className="forum-note">
              <Link to="/">Log in</Link> to create threads.
            </p>
          )}

          <ul className="forum-list">
            {threads.map((t) => (
              <li key={t.id}>
                <Link to={`/forum/thread/${t.id}`}>{t.title}</Link>
                <p className="forum-meta">
                  by {t.author?.display_name ?? 'unknown'} · {new Date(t.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          {threads.length === 0 && <p>No threads yet.</p>}
        </>
      )}
    </div>
  )
}
