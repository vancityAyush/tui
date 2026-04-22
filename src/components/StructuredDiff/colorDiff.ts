/**
 * Optional native syntax-highlighting backend.
 *
 * The upstream Claude Code build depends on `color-diff-napi` — a Rust NAPI
 * module that turns file contents into ANSI-colored lines. That module is
 * not part of the standalone `@vancityayush/tui` package. This shim returns
 * `null`, which makes `HighlightedCode` and `StructuredDiff` fall back to
 * plain-text rendering.
 *
 * To plug a real backend in, replace the exports of this file (or override
 * the module via your bundler) with wrappers around your preferred
 * highlighter. The public shape consumed by the components is:
 *
 *   class ColorFile {
 *     constructor(code: string, filePath: string)
 *     render(theme: unknown, width: number, dim: boolean): string[]
 *   }
 *
 *   class ColorDiff {
 *     constructor(patch: string, filePath: string)
 *     render(theme: unknown, width: number, dim: boolean): string[]
 *   }
 */

export type ColorModuleUnavailableReason = 'env' | 'native-module-missing'

export interface ColorFileCtor {
  new (code: string, filePath: string): {
    render(theme: unknown, width: number, dim: boolean): string[]
  }
}

export interface ColorDiffCtor {
  new (
    patch: unknown,
    firstLine: string | null,
    filePath: string,
    fileContent: string | null,
  ): {
    render(theme: unknown, width: number, dim: boolean): string[] | null
  }
}

export function getColorModuleUnavailableReason(): ColorModuleUnavailableReason | null {
  return 'native-module-missing'
}

export function expectColorDiff(): ColorDiffCtor | null {
  return null
}

export function expectColorFile(): ColorFileCtor | null {
  return null
}

export function getSyntaxTheme(_themeName: string): unknown {
  return null
}
