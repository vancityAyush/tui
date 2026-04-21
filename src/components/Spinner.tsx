import React, { useEffect, useState } from 'react'
import { Text } from '../ink.js'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const INTERVAL_MS = 80

type SpinnerProps = {
  label?: string
}

export function Spinner({ label }: SpinnerProps): React.ReactElement {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % FRAMES.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])
  const char = FRAMES[frame]!
  return <Text>{label ? `${char} ${label}` : char}</Text>
}

export default Spinner
