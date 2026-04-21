// Minimal log stubs for TUI layer.
// Consumers can call configureLogger to inject structured logging.

type Logger = {
  error: (msg: string, ...args: unknown[]) => void
}

let _logger: Logger = {
  error: (msg, ...args) => console.error('[tui error]', msg, ...args),
}

export function configureLogger(logger: Logger): void {
  _logger = logger
}

export function logError(msg: unknown): void {
  _logger.error(String(msg))
}
