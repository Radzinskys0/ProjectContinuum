import type { ReactNode } from 'react'
import { RULES, type Block } from './rulesContent'
import './Rules.css'

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_)/).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function renderBlock(block: Block, i: number) {
  if (typeof block === 'string') return <p key={i}>{renderInline(block)}</p>
  if ('list' in block) {
    return (
      <ul key={i}>
        {block.list.map((item, j) => (
          <li key={j}>{renderInline(item)}</li>
        ))}
      </ul>
    )
  }
  return (
    <p key={i}>
      {block.lines.map((line, j) => (
        <span key={j} className="rules-line">
          {renderInline(line)}
        </span>
      ))}
    </p>
  )
}

export default function Rules() {
  return (
    <div className="rules">
      {RULES.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.blocks.map(renderBlock)}
        </section>
      ))}
    </div>
  )
}
