export type FeatureFlag =
  | 'AUTO_THEME'
  | 'KAIROS'
  | 'KAIROS_BRIEF'
  | 'QUICK_SEARCH'
  | 'TERMINAL_PANEL'
  | 'MESSAGE_ACTIONS'
  | 'VOICE_MODE'
  | 'BUDDY'
  | 'ULTRAPLAN'
  | 'TOKEN_BUDGET'
  | 'TRANSCRIPT_CLASSIFIER'
  | 'HISTORY_PICKER'

// Runtime feature flags — set before render() for build-time equivalence.
const _flags: Partial<Record<FeatureFlag, boolean>> = {}

export function setFeatures(flags: Partial<Record<FeatureFlag, boolean>>): void {
  Object.assign(_flags, flags)
}

// Drop-in replacement for `feature()` from `bun:bundle`.
// Defaults to false when not configured.
export function feature(name: FeatureFlag): boolean {
  if (name in _flags) return !!_flags[name]
  const envKey = `TUI_FEATURE_${name}`
  return process.env[envKey] === '1' || process.env[envKey] === 'true'
}
