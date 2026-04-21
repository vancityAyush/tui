import type { ThemeSetting } from './theme.js'

// Minimal config surface the TUI layer needs — inject the full app config
// via configureHost() to override.

export type OutputStyle = string

export type PastedContent = {
  id: number
  type: 'text' | 'image'
  content: string
  mediaType?: string
  filename?: string
  sourcePath?: string
}

export interface HistoryEntry {
  display: string
  pastedContents: Record<number, PastedContent>
}

export interface GlobalConfig {
  theme: ThemeSetting
  [key: string]: unknown
}

const DEFAULT_CONFIG: GlobalConfig = { theme: 'dark' }

let _store: GlobalConfig = { ...DEFAULT_CONFIG }
let _saveImpl: (updater: (c: GlobalConfig) => GlobalConfig) => void = () => {}

export type HostConfig = {
  getGlobalConfig?: () => GlobalConfig
  saveGlobalConfig?: (updater: (c: GlobalConfig) => GlobalConfig) => void
}

let _getImpl: () => GlobalConfig = () => _store

export function configureHost(opts: HostConfig): void {
  if (opts.getGlobalConfig) _getImpl = opts.getGlobalConfig
  if (opts.saveGlobalConfig) _saveImpl = opts.saveGlobalConfig
}

export function getGlobalConfig(): GlobalConfig {
  return _getImpl()
}

export function saveGlobalConfig(updater: (c: GlobalConfig) => GlobalConfig): void {
  if (_saveImpl) {
    _saveImpl(updater)
  } else {
    _store = updater(_store)
  }
}
