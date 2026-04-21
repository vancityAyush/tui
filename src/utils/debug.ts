// Minimal debug stub for TUI package.
// Set TUI_DEBUG=1 to log to stderr; otherwise silent.

const _enabled = process.env.TUI_DEBUG === '1'

export type DebugLogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error'

export function logForDebugging(msg: unknown, ...args: unknown[]): void {
  if (_enabled) {
    process.stderr.write(`[tui:debug] ${String(msg)}${args.length ? ' ' + args.map(String).join(' ') : ''}\n`)
  }
}

export function debugLog(_level: DebugLogLevel, msg: unknown, ...args: unknown[]): void {
  logForDebugging(msg, ...args)
}

export const isDebugEnabled = _enabled
