import React, { useState } from 'react'
import { render, Box, Text, useInput } from '../src/index.js'

function KeyDemo() {
  const [last, setLast] = useState('(none)')
  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === 'c')) process.exit(0)
    const parts = []
    if (key.ctrl) parts.push('ctrl')
    if (key.alt) parts.push('alt')
    if (key.shift) parts.push('shift')
    if (key.meta) parts.push('meta')
    parts.push(key.return ? 'Enter' : key.tab ? 'Tab' : key.delete ? 'Del' : input || '?')
    setLast(parts.join('+'))
  })
  return (
    <Box borderStyle="round" paddingX={1} flexDirection="column">
      <Text bold>Keybinding demo</Text>
      <Text>Last key: <Text color="green">{last}</Text></Text>
      <Text dimColor>Press Esc or Ctrl+C to exit</Text>
    </Box>
  )
}

const { unmount, waitUntilExit } = await render(<KeyDemo />)

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
} else {
  setTimeout(() => { unmount(); process.exit(0) }, 500)
}

await waitUntilExit()
