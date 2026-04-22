/// <reference lib="dom" />

import { extname } from 'path'

export type CliHighlight = {
  highlight: (code: string, options: { language: string }) => string
  supportsLanguage: (lang: string) => boolean
}

/**
 * Lazy-loaded syntax highlighter. `cli-highlight` and `highlight.js` are
 * intentionally NOT bundled with @vancityayush/tui — they pull in a heavy
 * language registry. Callers can install them and this module will pick
 * them up at runtime, otherwise `getCliHighlightPromise()` resolves to
 * `null` and consumers render plain text.
 */
let cliHighlightPromise: Promise<CliHighlight | null> | undefined

// `any` because highlight.js may not be installed — avoid type-time dep.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadedGetLanguage: ((lang: string) => { name?: string } | null) | undefined

async function loadCliHighlight(): Promise<CliHighlight | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cliHighlight: any = await import('cli-highlight' as string).catch(() => null)
    if (!cliHighlight) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const highlightJs: any = await import('highlight.js' as string).catch(() => null)
    loadedGetLanguage = highlightJs?.default?.getLanguage ?? highlightJs?.getLanguage
    return {
      highlight: cliHighlight.highlight,
      supportsLanguage: cliHighlight.supportsLanguage,
    }
  } catch {
    return null
  }
}

export function getCliHighlightPromise(): Promise<CliHighlight | null> {
  cliHighlightPromise ??= loadCliHighlight()
  return cliHighlightPromise
}

/**
 * e.g. "foo/bar.ts" → "TypeScript". Resolves `"unknown"` when
 * highlight.js is not installed.
 */
export async function getLanguageName(file_path: string): Promise<string> {
  await getCliHighlightPromise()
  const ext = extname(file_path).slice(1)
  if (!ext) return 'unknown'
  return loadedGetLanguage?.(ext)?.name ?? 'unknown'
}
