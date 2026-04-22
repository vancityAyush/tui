import { describe, expect, test } from 'bun:test'
import {
  StructuredDiff,
  StructuredDiffFallback,
  expectColorDiff,
  expectColorFile,
  getColorModuleUnavailableReason,
  getSyntaxTheme,
} from '../src/index.js'
import {
  calculateWordDiffs,
  numberDiffLines,
  processAdjacentLines,
  transformLinesToObjects,
} from '../src/components/StructuredDiff/Fallback.js'

describe('StructuredDiff component exports', () => {
  test('components are functions', () => {
    expect(StructuredDiff).toBeDefined()
    expect(StructuredDiffFallback).toBeFunction()
  })
})

describe('color module stubs', () => {
  test('unavailable reason reports native-module-missing', () => {
    expect(getColorModuleUnavailableReason()).toBe('native-module-missing')
  })
  test('ctors return null (native module absent)', () => {
    expect(expectColorDiff()).toBeNull()
    expect(expectColorFile()).toBeNull()
  })
  test('getSyntaxTheme returns null', () => {
    expect(getSyntaxTheme('dark')).toBeNull()
  })
})

describe('transformLinesToObjects', () => {
  test('tags + as add, - as remove, space as nochange', () => {
    const out = transformLinesToObjects([' ctx', '+added', '-removed'])
    expect(out.map(o => o.type)).toEqual(['nochange', 'add', 'remove'])
    expect(out[0]!.code).toBe('ctx')
    expect(out[1]!.code).toBe('added')
    expect(out[2]!.code).toBe('removed')
  })
})

describe('processAdjacentLines', () => {
  test('pairs adjacent remove/add when similar enough', () => {
    const lines = transformLinesToObjects(['-foo bar baz', '+foo qux baz'])
    const out = processAdjacentLines(lines)
    const paired = out.filter(l => l.wordDiff)
    expect(paired.length).toBeGreaterThan(0)
  })

  test('leaves standalone remove/add untagged', () => {
    const lines = transformLinesToObjects([' ctx', '+lone'])
    const out = processAdjacentLines(lines)
    expect(out.every(l => l.wordDiff !== true)).toBe(true)
  })
})

describe('calculateWordDiffs', () => {
  test('marks changed words added/removed', () => {
    const parts = calculateWordDiffs('foo bar', 'foo baz')
    const hasAdded = parts.some(p => p.added)
    const hasRemoved = parts.some(p => p.removed)
    expect(hasAdded).toBe(true)
    expect(hasRemoved).toBe(true)
  })
})

describe('numberDiffLines', () => {
  test('assigns monotonically increasing line numbers', () => {
    const lines = transformLinesToObjects([' a', '+b', ' c'])
    const out = numberDiffLines(lines, 10)
    expect(out.map(l => l.i)).toEqual([10, 11, 12])
  })
  test('removed lines do not advance the counter beyond adds/context balance', () => {
    const lines = transformLinesToObjects([' a', '-b', '+c', ' d'])
    const out = numberDiffLines(lines, 1)
    expect(out[0]!.i).toBe(1)
    expect(out[3]!.i).toBeGreaterThan(out[0]!.i)
  })
})
