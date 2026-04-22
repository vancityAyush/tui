import { createRequire } from 'module'

export type ModifierKey = 'shift' | 'command' | 'control' | 'option'

let prewarmed = false
const requireNative = createRequire(import.meta.url)
const MODIFIERS_MODULE = 'modifiers-napi'

function loadModifiersModule():
  | {
      prewarm?: () => void
      isModifierPressed?: (modifier: string) => boolean
    }
  | null {
  try {
    return requireNative(MODIFIERS_MODULE) as {
      prewarm?: () => void
      isModifierPressed?: (modifier: string) => boolean
    }
  } catch {
    return null
  }
}

/**
 * Pre-warm the native module by loading it in advance.
 * Call this early to avoid delay on first use.
 */
export function prewarmModifiers(): void {
  if (prewarmed || process.platform !== 'darwin') {
    return
  }
  prewarmed = true
  // Load module in background
  try {
    loadModifiersModule()?.prewarm?.()
  } catch {
    // Ignore errors during prewarm
  }
}

/**
 * Check if a specific modifier key is currently pressed (synchronous).
 */
export function isModifierPressed(modifier: ModifierKey): boolean {
  if (process.platform !== 'darwin') {
    return false
  }
  return loadModifiersModule()?.isModifierPressed?.(modifier) ?? false
}
