import type { ThemeName } from './theme.js'

// Stub: AUTO_THEME feature is disabled by default; this module is dynamically
// imported only when feature('AUTO_THEME') is true. Provide a no-op watcher.
export function watchSystemTheme(
  _querier: unknown,
  _cb: (theme: ThemeName) => void,
): () => void {
  return () => {}
}
