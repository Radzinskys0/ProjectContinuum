import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TodoList from '../components/TodoList'
import MoreInformation from '../components/MoreInformation'
import './Master.css'

const SECTIONS = [
  { id: 'todos', label: "To do's" },
  { id: 'more-info', label: 'More information' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

const PLACEHOLDER_SLOTS = 3

export default function Master() {
  const [section, setSection] = useState<SectionId>('todos')
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate('/')}>Go back</button>
      <h1>Master</h1>
      <div className="master-panel">
        <nav className="master-sidebar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={section === s.id ? 'active' : ''}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
          {Array.from({ length: PLACEHOLDER_SLOTS }).map((_, i) => (
            <button key={`placeholder-${i}`} className="placeholder" disabled>
              —
            </button>
          ))}
        </nav>
        <div className="master-content">
          {section === 'todos' && <TodoList />}
          {section === 'more-info' && <MoreInformation />}
        </div>
      </div>
    </div>
  )
}
