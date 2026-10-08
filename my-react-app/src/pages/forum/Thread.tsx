import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../auth/AuthContext'
import AuthorName from '../../components/AuthorName'
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
  const { session, role, timedOutUntil } = useAuth()
  const [thread, setThread] = useState<{ title: string; topic_id: number; author_id: string; pinned: boolean } | null>(null)
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
        supabase.from('threads').select('title, topic_id, author_id, pinned').eq('id', threadId).maybeSingle(),
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
      setFormError(error.code === '42501' ? 'You cannot post right now. You may be timed out.' : error.message)
    } else {
      setPosts((prev) => [...prev, data as unknown as PostRow])
      setReply('')
    }
    setSubmitting(false)
  }

  const togglePin = async () => {
    if (!thread) return
    setDeleteError('')
    const { error } = await supabase.rpc('set_thread_pinned', {
      p_thread_id: Number(threadId),
      p_pinned: !thread.pinned,
    })
    if (error) setDeleteError(error.message)
    else setThread({ ...thread, pinned: !thread.pinned })
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
          {thread.pinned && <p className="forum-pin-label">Pinned</p>}
          {role === 'gm' && <button onClick={togglePin}>{thread.pinned ? 'Unpin thread' : 'Pin thread'}</button>}
          {canDelete(thread.author_id) && <button onClick={deleteThread}>Delete thread</button>}
          {deleteError && <p>{deleteError}</p>}
          <div className="forum-posts">
            {posts.map((p, i) => (
              <article key={p.id} className="forum-post">
                <div className="forum-meta">
                  <AuthorName userId={p.author_id} name={p.author?.display_name ?? 'unknown'} /> ·{' '}
                  {new Date(p.created_at).toLocaleString()}
                </div>
                <p className="forum-body">{p.body}</p>
                {i > 0 && canDelete(p.author_id) && <button onClick={() => deletePost(p.id)}>Delete</button>}
              </article>
            ))}
          </div>

          {session && timedOutUntil ? (
            <p className="forum-note forum-timeout">
              You are timed out until {timedOutUntil.toLocaleString()} and cannot reply.
            </p>
          ) : session ? (
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
