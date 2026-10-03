import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../utils/supabase'
import './ServantsList.css'

type Servant = {
  id: number
  Name: string
  Hidden_Attribute: string | null
  Power_Ranking: string | null
  Difficulty_Ranking: string | null
}

export default function ServantsList() {
  const [servants, setServants] = useState<Servant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('Servants')
        .select('id, Name, Hidden_Attribute, Power_Ranking, Difficulty_Ranking')
        .order('Name')
      if (error) setError(error.message)
      else setServants(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? servants.filter((s) => s.Name.toLowerCase().includes(q)) : servants
  }, [servants, query])

  const selected = servants.find((s) => s.id === selectedId) ?? null

  if (loading) return <p>Loading...</p>
  if (error) return <p>Could not load servants: {error}</p>

  return (
    <div className="servants">
      <div className="servants-list-col">
        <input
          type="search"
          placeholder="Search servants"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="servants-names">
          {filtered.map((s) => (
            <li key={s.id}>
              <button
                className={s.id === selectedId ? 'active' : ''}
                onClick={() => setSelectedId(s.id)}
              >
                {s.Name}
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="servants-empty">No matches</li>}
        </ul>
      </div>
      <div className="servants-detail-col">
        {selected && (
          <>
            <h2>{selected.Name}</h2>
            <dl>
              <dt>Hidden attribute</dt>
              <dd>{selected.Hidden_Attribute ?? '—'}</dd>
              <dt>Power ranking</dt>
              <dd>{selected.Power_Ranking ?? '—'}</dd>
              <dt>Difficulty ranking</dt>
              <dd>{selected.Difficulty_Ranking ?? '—'}</dd>
            </dl>
          </>
        )}
      </div>
    </div>
  )
}
