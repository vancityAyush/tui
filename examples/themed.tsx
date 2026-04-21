import React, { useState } from 'react'
import { render, ThemeProvider, Box, Text, useInput } from '../src/index.js'

function ThemeDemo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useInput((_input, key) => {
    if (key.return || key.escape) process.exit(0)
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  })
  return (
    <ThemeProvider initialState={theme}>
      <Box borderStyle="round" paddingX={1} flexDirection="column">
        <Text bold>Theme: {theme}</Text>
        <Text>Press any key to toggle theme, Enter/Esc to exit</Text>
      </Box>
    </ThemeProvider>
  )
}

const { unmount, waitUntilExit } = await render(<ThemeDemo />)

if (!process.stdin.isTTY) {
  setTimeout(() => { unmount(); process.exit(0) }, 500)
}

await waitUntilExit()
