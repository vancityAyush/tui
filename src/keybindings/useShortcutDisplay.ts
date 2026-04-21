import { useOptionalKeybindingContext } from './KeybindingContext.js'
import type { KeybindingContextName } from './types.js'

export function useShortcutDisplay(
  action: string,
  context: KeybindingContextName,
  fallback: string,
): string {
  const keybindingContext = useOptionalKeybindingContext()
  const resolved = keybindingContext?.getDisplayText(action, context)
  return resolved ?? fallback
}
