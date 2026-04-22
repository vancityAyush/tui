import { describe, expect, test } from 'bun:test'

import {
  BaseTextInput,
  FilePathLink,
  PressEnterToContinue,
  TextInput,
  ToolUseLoader,
  VimTextInput,
} from '../src/index.js'

describe('packages/tui public API', () => {
  test('exports the shared input and utility components', () => {
    expect(BaseTextInput).toBeFunction()
    expect(TextInput).toBeFunction()
    expect(VimTextInput).toBeFunction()
    expect(ToolUseLoader).toBeFunction()
    expect(FilePathLink).toBeFunction()
    expect(PressEnterToContinue).toBeFunction()
  })
})
