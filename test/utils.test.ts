import { describe, expect, test } from 'bun:test'
import {
  OSC8_END,
  OSC8_START,
  convertLeadingTabsToSpaces,
  createHyperlink,
  djb2Hash,
  escapeXml,
  hashContent,
  hashPair,
  stripPromptXMLTags,
} from '../src/index.js'

describe('hash utils', () => {
  test('djb2Hash is deterministic', () => {
    expect(djb2Hash('hello')).toBe(djb2Hash('hello'))
    expect(djb2Hash('hello')).not.toBe(djb2Hash('world'))
  })

  test('djb2Hash returns signed 32-bit int', () => {
    expect(Number.isInteger(djb2Hash('anything'))).toBe(true)
  })

  test('hashContent is deterministic and distinct', () => {
    expect(hashContent('a')).toBe(hashContent('a'))
    expect(hashContent('a')).not.toBe(hashContent('b'))
  })

  test('hashPair order-sensitive', () => {
    expect(hashPair('a', 'b')).toBe(hashPair('a', 'b'))
    expect(hashPair('a', 'b')).not.toBe(hashPair('b', 'a'))
  })
})

describe('xml escape', () => {
  test('escapes &, <, >', () => {
    expect(escapeXml('<a & b>')).toBe('&lt;a &amp; b&gt;')
  })
  test('leaves plain text alone', () => {
    expect(escapeXml('hello')).toBe('hello')
  })
})

describe('stripPromptXMLTags', () => {
  test('strips known tags', () => {
    const input = '<context>junk</context>\nreal content'
    expect(stripPromptXMLTags(input)).toBe('real content')
  })
  test('handles multiline tag body', () => {
    const input = '<commit_analysis>line1\nline2</commit_analysis>\nafter'
    expect(stripPromptXMLTags(input)).toBe('after')
  })
  test('leaves unknown tags untouched', () => {
    expect(stripPromptXMLTags('<foo>bar</foo>')).toBe('<foo>bar</foo>')
  })
  test('trims result', () => {
    expect(stripPromptXMLTags('   hello   ')).toBe('hello')
  })
})

describe('convertLeadingTabsToSpaces', () => {
  test('no-op when no tabs', () => {
    expect(convertLeadingTabsToSpaces('abc\ndef')).toBe('abc\ndef')
  })
  test('each leading tab becomes two spaces', () => {
    expect(convertLeadingTabsToSpaces('\tabc')).toBe('  abc')
    expect(convertLeadingTabsToSpaces('\t\tabc')).toBe('    abc')
  })
  test('leaves interior tabs alone', () => {
    expect(convertLeadingTabsToSpaces('a\tb')).toBe('a\tb')
  })
})

describe('hyperlink', () => {
  test('returns url when terminal lacks hyperlink support', () => {
    expect(createHyperlink('https://x.com', 'X', { supportsHyperlinks: false })).toBe(
      'https://x.com',
    )
  })
  test('wraps with OSC 8 when supported', () => {
    const out = createHyperlink('https://x.com', 'X', { supportsHyperlinks: true })
    expect(out.startsWith(OSC8_START)).toBe(true)
    expect(out.endsWith(OSC8_END)).toBe(true)
    expect(out).toContain('https://x.com')
    expect(out).toContain('X')
  })
  test('uses url as display text when content omitted', () => {
    const out = createHyperlink('https://x.com', undefined, { supportsHyperlinks: true })
    expect(out).toContain('https://x.com')
  })
})
