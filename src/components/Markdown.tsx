import { marked, type Token, type Tokens } from 'marked'
import React, { Suspense, use, useMemo, useRef } from 'react'
import { Ansi } from '../ink/Ansi.js'
import Box from '../ink/components/Box.js'
import { useTheme } from './design-system/ThemeProvider.js'
import {
  type CliHighlight,
  getCliHighlightPromise,
} from '../utils/cliHighlight.js'
import { hashContent } from '../utils/hash.js'
import { configureMarked, formatToken } from '../utils/markdown.js'
import { stripPromptXMLTags } from '../utils/stripPromptXMLTags.js'
import { MarkdownTable } from './MarkdownTable.js'

type Props = {
  children: string
  /** When true, render all text content as dim */
  dimColor?: boolean
  /**
   * Skip async cli-highlight loading and render plain markdown.
   * Mirrors the upstream `useSettings().syntaxHighlightingDisabled` check —
   * pass your app's config here.
   */
  syntaxHighlightingDisabled?: boolean
}

const TOKEN_CACHE_MAX = 500
const tokenCache = new Map<string, Token[]>()

const MD_SYNTAX_RE = /[#*`|[>\-_~]|\n\n|^\d+\. |\n\d+\. /

function hasMarkdownSyntax(s: string): boolean {
  return MD_SYNTAX_RE.test(s.length > 500 ? s.slice(0, 500) : s)
}

function cachedLexer(content: string): Token[] {
  if (!hasMarkdownSyntax(content)) {
    return [
      {
        type: 'paragraph',
        raw: content,
        text: content,
        tokens: [{ type: 'text', raw: content, text: content }],
      } as Token,
    ]
  }
  const key = hashContent(content)
  const hit = tokenCache.get(key)
  if (hit) {
    tokenCache.delete(key)
    tokenCache.set(key, hit)
    return hit
  }
  const tokens = marked.lexer(content)
  if (tokenCache.size >= TOKEN_CACHE_MAX) {
    const first = tokenCache.keys().next().value
    if (first !== undefined) tokenCache.delete(first)
  }
  tokenCache.set(key, tokens)
  return tokens
}

/**
 * Renders markdown content using a hybrid approach:
 * - Tables are rendered as React components with proper flexbox layout
 * - Other content is rendered as ANSI strings via formatToken
 */
export function Markdown(props: Props): React.ReactNode {
  if (props.syntaxHighlightingDisabled) {
    return <MarkdownBody {...props} highlight={null} />
  }
  return (
    <Suspense fallback={<MarkdownBody {...props} highlight={null} />}>
      <MarkdownWithHighlight {...props} />
    </Suspense>
  )
}

function MarkdownWithHighlight(props: Props): React.ReactNode {
  const highlight = use(getCliHighlightPromise())
  return <MarkdownBody {...props} highlight={highlight} />
}

function MarkdownBody({
  children,
  dimColor,
  highlight,
}: Props & { highlight: CliHighlight | null }): React.ReactNode {
  const [theme] = useTheme()
  configureMarked()

  const elements = useMemo(() => {
    const tokens = cachedLexer(stripPromptXMLTags(children))
    const out: React.ReactNode[] = []
    let nonTableContent = ''

    function flushNonTableContent(): void {
      if (nonTableContent) {
        out.push(
          <Ansi key={out.length} dimColor={dimColor}>
            {nonTableContent.trim()}
          </Ansi>,
        )
        nonTableContent = ''
      }
    }

    for (const token of tokens) {
      if (token.type === 'table') {
        flushNonTableContent()
        out.push(
          <MarkdownTable
            key={out.length}
            token={token as Tokens.Table}
            highlight={highlight}
          />,
        )
      } else {
        nonTableContent += formatToken(token, theme, 0, null, null, highlight)
      }
    }

    flushNonTableContent()
    return out
  }, [children, dimColor, highlight, theme])

  return (
    <Box flexDirection="column" gap={1}>
      {elements}
    </Box>
  )
}

type StreamingProps = {
  children: string
}

/**
 * Renders markdown during streaming by splitting at the last top-level block
 * boundary: everything before is stable (memoized, never re-parsed), only the
 * final block is re-parsed per delta.
 */
export function StreamingMarkdown({
  children,
}: StreamingProps): React.ReactNode {
  'use no memo'

  configureMarked()

  const stripped = stripPromptXMLTags(children)
  const stablePrefixRef = useRef('')

  if (!stripped.startsWith(stablePrefixRef.current)) {
    stablePrefixRef.current = ''
  }

  const boundary = stablePrefixRef.current.length
  const tokens = marked.lexer(stripped.substring(boundary))

  let lastContentIdx = tokens.length - 1
  while (lastContentIdx >= 0 && tokens[lastContentIdx]!.type === 'space') {
    lastContentIdx--
  }
  let advance = 0
  for (let i = 0; i < lastContentIdx; i++) {
    advance += tokens[i]!.raw.length
  }
  if (advance > 0) {
    stablePrefixRef.current = stripped.substring(0, boundary + advance)
  }
  const stablePrefix = stablePrefixRef.current
  const unstableSuffix = stripped.substring(stablePrefix.length)

  return (
    <Box flexDirection="column" gap={1}>
      {stablePrefix && <Markdown>{stablePrefix}</Markdown>}
      {unstableSuffix && <Markdown>{unstableSuffix}</Markdown>}
    </Box>
  )
}
