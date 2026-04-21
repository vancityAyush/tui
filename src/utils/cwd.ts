// Stub: cwd utilities for TUI layer.
// Full app can inject via configureHost if needed; default is process.cwd().

export function getCwd(): string {
  return process.cwd()
}

export function pwd(): string {
  return process.cwd()
}

export function runWithCwdOverride<T>(_cwd: string, fn: () => T): T {
  return fn()
}
