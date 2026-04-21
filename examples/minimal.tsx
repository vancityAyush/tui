import React from 'react'
import { render, Box, Text } from '../src/index.js'

const { unmount, waitUntilExit } = await render(
  <Box borderStyle="round" paddingX={1}>
    <Text color="cyan">hello tui — press any key to exit</Text>
  </Box>
)

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
  process.stdin.once('data', () => {
    unmount()
    process.exit(0)
  })
} else {
  // Non-interactive: exit cleanly after render
  setTimeout(() => { unmount(); process.exit(0) }, 500)
}

await waitUntilExit()
