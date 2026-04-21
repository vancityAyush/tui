import 'react'

// Ink custom DOM elements used as intrinsic JSX elements by the renderer
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ink-box': Record<string, unknown>
      'ink-text': Record<string, unknown>
      'ink-link': Record<string, unknown>
      'ink-raw-ansi': Record<string, unknown>
      'ink-virtual-text': Record<string, unknown>
    }
  }
}
