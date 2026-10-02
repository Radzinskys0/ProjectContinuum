import { useMemo } from 'react'

const MESSAGES = [
  'The dice remember everything.',
  'A GM once rolled a natural 20 on a perception check... to notice they forgot snacks.',
  'Somewhere, a Servant is judging your Command Seals.',
  'This panel is still under construction.',
  'Rumor has it the Throne of Heroes has a complaints department.',
]

export default function MoreInformation() {
  const message = useMemo(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)], [])

  return (
    <div>
      <p>{message}</p>
    </div>
  )
}
