import { loadKeybindingsSync } from './loadUserBindings.js'
import { getBindingDisplayText } from './resolver.js'
import type { KeybindingContextName } from './types.js'

const LOGGED_FALLBACKS = new Set<string>()

export function getShortcutDisplay(
  action: string,
  context: KeybindingContextName,
  fallback: string,
): string {
  const bindings = loadKeybindingsSync()
  const resolved = getBindingDisplayText(action, context, bindings)
  if (resolved === undefined) {
    LOGGED_FALLBACKS.add(`${action}:${context}`)
    return fallback
  }
  return resolved
}
