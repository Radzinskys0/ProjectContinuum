import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../auth/AuthContext'
import './Forum.css'

type PostRow = {
  id: number
  author_id: string
  body: string
  created_at: string
  author: { display_name: string } | null
}

const POST_COLUMNS = 'id, author_id, body, created_at, author:profiles(display_name)'

export default function Thread() {
  const { threadId } = useParams()
  const navigate = useNavigate()
  const { session, role } = useAuth()
  const [thread, setThread] = useState<{ title: string; topic_id: number; author_id: string } | null>(null)
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const canDelete = (authorId: string) => !!session && (session.user.id === authorId || role === 'gm')

  useEffect(() => {
    async function load() {
      const [threadRes, postsRes] = await Promise.all([
        supabase.from('threads').select('title, topic_id, author_id').eq('id', threadId).maybeSingle(),
        supabase.from('posts').select(POST_COLUMNS).eq('thread_id', threadId).order('created_at'),
      ])
      if (threadRes.error || postsRes.error) {
        setError((threadRes.error ?? postsRes.error)!.message)
      } else if (!threadRes.data) {
        setError('Thread not found.')
      } else {
        setThread(threadRes.data)
        setPosts((postsRes.data ?? []) as unknown as PostRow[])
      }
      setLoading(false)
    }
    load()
  }, [threadId])

  const sendReply = async () => {
    setSubmitting(true)
    setFormError('')
    const { data, error } = await supabase
      .from('posts')
      .insert({ thread_id: Number(threadId), body: reply.trim() })
      .select(POST_COLUMNS)
      .single()
    if (error) {
      setFormError(error.message)
    } else {
      setPosts((prev) => [...prev, data as unknown as PostRow])
      setReply('')
    }
    setSubmitting(false)
  }

  const deleteThread = async () => {
    if (!thread || !window.confirm('Delete this thread and all its posts?')) return
    setDeleteError('')
    const { data, error } = await supabase.from('threads').delete().eq('id', threadId).select('id')
    if (error || !data || data.length === 0) {
      setDeleteError(error ? error.message : 'Could not delete the thread.')
    } else {
      navigate(`/forum/topic/${thread.topic_id}`)
    }
  }

  const deletePost = async (postId: number) => {
    if (!window.confirm('Delete this reply?')) return
    setDeleteError('')
    const { data, error } = await supabase.from('posts').delete().eq('id', postId).select('id')
    if (error || !data || data.length === 0) {
      setDeleteError(error ? error.message : 'Could not delete the reply.')
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  return (
    <div className="forum">
      <button onClick={() => navigate(thread ? `/forum/topic/${thread.topic_id}` : '/forum')}>Go back</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {thread && (
        <>
          <h1>{thread.title}</h1>
          {canDelete(thread.author_id) && <button onClick={deleteThread}>Delete thread</button>}
          {deleteError && <p>{deleteError}</p>}
          <div className="forum-posts">
            {posts.map((p, i) => (
              <article key={p.id} className="forum-post">
                <p className="forum-meta">
                  {p.author?.display_name ?? 'unknown'} · {new Date(p.created_at).toLocaleString()}
                </p>
                <p className="forum-body">{p.body}</p>
                {i > 0 && canDelete(p.author_id) && <button onClick={() => deletePost(p.id)}>Delete</button>}
              </article>
            ))}
          </div>

          {session ? (
            <div className="forum-form">
              <h2>Reply</h2>
              <textarea
                placeholder="Write a reply"
                rows={4}
                maxLength={10000}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button onClick={sendReply} disabled={submitting || !reply.trim()}>
                Post reply
              </button>
              {formError && <p>{formError}</p>}
            </div>
          ) : (
            <p className="forum-note">
              <Link to="/">Log in</Link> to reply.
            </p>
          )}
        </>
      )}
    </div>
  )
}
