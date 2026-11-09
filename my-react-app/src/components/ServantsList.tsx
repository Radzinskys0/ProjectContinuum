import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../utils/supabase'
import './ServantsList.css'

type Servant = {
  id: number
  Name: string
  Hidden_Attribute: string | null
  Power_Ranking: string | null
  Difficulty_Ranking: string | null
  Image_Url: string | null
  Document_Url: string | null
  Artist_URL: string | null
}

type FilterKey = 'Hidden_Attribute' | 'Power_Ranking' | 'Difficulty_Ranking'

const FILTERS: { key: FilterKey; label: string; ranked: boolean }[] = [
  { key: 'Hidden_Attribute', label: 'Hidden attribute', ranked: false },
  { key: 'Power_Ranking', label: 'Power ranking', ranked: true },
  { key: 'Difficulty_Ranking', label: 'Difficulty ranking', ranked: true },
]

const NO_FILTERS: Record<FilterKey, string> = { Hidden_Attribute: '', Power_Ranking: '', Difficulty_Ranking: '' }

// Ranks sort E < D < C < B < A < EX, with "-" just below and "+" just above the base letter.
const RANK_ORDER = ['E', 'D', 'C', 'B', 'A', 'EX']
const rankKey = (value: string): [number, number] => {
  const m = value.trim().toUpperCase().match(/^([A-Z]+)([+-]?)$/)
  const base = m ? RANK_ORDER.indexOf(m[1]) : -1
  if (!m || base === -1) return [Infinity, 0]
  return [base, m[2] === '+' ? 1 : m[2] === '-' ? -1 : 0]
}
const compareRanks = (a: string, b: string) => {
  const [ka, kb] = [rankKey(a), rankKey(b)]
  return ka[0] - kb[0] || ka[1] - kb[1] || a.localeCompare(b)
}

// Only plain web links are allowed, so a bad value in the table can never become a script link.
const webUrl = (value: string | null) => {
  if (!value) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export default function ServantsList() {
  const [servants, setServants] = useState<Servant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(NO_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('Servants')
        .select('id, Name, Hidden_Attribute, Power_Ranking, Difficulty_Ranking, Image_Url, Document_Url, Artist_URL')
        .order('Name')
      if (error) setError(error.message)
      else setServants(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Options come from the data itself, so new values (or Difficulty ranking once it has data) appear automatically.
  const options = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const f of FILTERS) {
      const values = [...new Set(servants.map((s) => s[f.key]).filter((v): v is string => !!v && v.trim() !== ''))]
      result[f.key] = values.sort(f.ranked ? compareRanks : (a, b) => a.localeCompare(b))
    }
    return result
  }, [servants])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return servants.filter(
      (s) =>
        (!q || s.Name.toLowerCase().includes(q)) &&
        FILTERS.every((f) => !filters[f.key] || s[f.key] === filters[f.key]),
    )
  }, [servants, query, filters])

  const activeFilters = FILTERS.filter((f) => filters[f.key])
  const hasActive = activeFilters.length > 0 || query.trim() !== ''

  const clearAll = () => {
    setQuery('')
    setFilters(NO_FILTERS)
  }

  const selected = servants.find((s) => s.id === selectedId) ?? null
  const artistUrl = webUrl(selected?.Artist_URL ?? null)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Could not load servants: {error}</p>

  return (
    <div className="servants">
      <div className="servants-list-col">
        <div className="servants-search-row">
          <input
            type="search"
            placeholder="Search servants"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="servants-filter-btn"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
          </button>
          {filtersOpen && (
            <div className="servants-filter-panel">
              {FILTERS.map((f) => (
                <label key={f.key}>
                  {f.label}
                  <select
                    value={filters[f.key]}
                    disabled={options[f.key].length === 0}
                    onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })}
                  >
                    <option value="">{options[f.key].length === 0 ? 'No data yet' : 'Any'}</option>
                    {options[f.key].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <button onClick={() => setFiltersOpen(false)}>Done</button>
            </div>
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="servants-chips">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                className="servants-chip"
                title="Remove this filter"
                onClick={() => setFilters({ ...filters, [f.key]: '' })}
              >
                {f.label}: {filters[f.key]} ×
              </button>
            ))}
          </div>
        )}

        <div className="servants-status">
          <span>
            {filtered.length} of {servants.length}
          </span>
          {hasActive && <button onClick={clearAll}>Clear filters</button>}
        </div>

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
            <div className="servants-info">
              <h2>{selected.Name}</h2>
              <dl>
                <dt>Hidden attribute</dt>
                <dd>{selected.Hidden_Attribute ?? '—'}</dd>
                <dt>Power ranking</dt>
                <dd>{selected.Power_Ranking ?? '—'}</dd>
                <dt>Difficulty ranking</dt>
                <dd>{selected.Difficulty_Ranking ?? '—'}</dd>
                <dt>
                  {selected.Document_Url ? (
                    <a href={selected.Document_Url} target="_blank" rel="noopener noreferrer">
                      True name discernment
                    </a>
                  ) : (
                    '—'
                  )}
                </dt>
              </dl>
            </div>
            {(selected.Image_Url || artistUrl) && (
              <div className="servants-media">
                <div className="servants-figure">
                  {selected.Image_Url && (
                    <img
                      className="servants-image"
                      src={selected.Image_Url}
                      alt={selected.Name}
                    />
                  )}
                  {artistUrl && (
                    <a className="servants-artist" href={artistUrl} target="_blank" rel="noopener noreferrer">
                      Artist page
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
