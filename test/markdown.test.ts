import { describe, expect, test } from 'bun:test'
import { marked } from 'marked'
import stripAnsi from 'strip-ansi'
import {
  Markdown,
  StreamingMarkdown,
  applyMarkdown,
  configureMarked,
  formatToken,
  padAligned,
} from '../src/index.js'

describe('markdown exports', () => {
  test('Markdown + StreamingMarkdown are components', () => {
    expect(Markdown).toBeFunction()
    expect(StreamingMarkdown).toBeFunction()
  })

  test('helpers exported', () => {
    expect(configureMarked).toBeFunction()
    expect(applyMarkdown).toBeFunction()
    expect(formatToken).toBeFunction()
    expect(padAligned).toBeFunction()
  })
})

describe('padAligned', () => {
  test('left align pads right', () => {
    expect(padAligned('a', 1, 5, 'left')).toBe('a    ')
  })
  test('right align pads left', () => {
    expect(padAligned('a', 1, 5, 'right')).toBe('    a')
  })
  test('center align splits', () => {
    expect(padAligned('a', 1, 5, 'center')).toBe('  a  ')
  })
  test('no-op when already wide', () => {
    expect(padAligned('abcde', 5, 5, 'left')).toBe('abcde')
  })
})

describe('formatToken', () => {
  test('plain paragraph round-trips text', () => {
    configureMarked()
    const [tok] = marked.lexer('hello world')
    const out = formatToken(tok!, 'dark', 0, null, null, null)
    expect(stripAnsi(out)).toContain('hello world')
  })

  test('heading renders with content', () => {
    configureMarked()
    const [tok] = marked.lexer('# Title')
    const out = formatToken(tok!, 'dark', 0, null, null, null)
    expect(stripAnsi(out)).toContain('Title')
  })

  test('list numbers items', () => {
    configureMarked()
    const [tok] = marked.lexer('1. a\n2. b\n')
    const out = formatToken(tok!, 'dark', 0, null, null, null)
    const plain = stripAnsi(out)
    expect(plain).toContain('a')
    expect(plain).toContain('b')
  })

  test('codespan renders content', () => {
    configureMarked()
    const [tok] = marked.lexer('`inline`')
    const out = formatToken(tok!, 'dark', 0, null, null, null)
    expect(stripAnsi(out)).toContain('inline')
  })
})

describe('applyMarkdown', () => {
  test('returns string for simple input', () => {
    const out = applyMarkdown('hello', 'dark', null)
    expect(typeof out).toBe('string')
    expect(stripAnsi(out)).toContain('hello')
  })
})
