import type React from 'react'
import type { Key } from '../ink.js'
import type { ImageDimensions } from '../utils/imageResizer.js'
import type { TextHighlight } from '../utils/textHighlighting.js'

export type InlineGhostText = {
  readonly text: string
  readonly fullCommand: string
  readonly insertPosition: number
}

export type BaseTextInputProps = {
  readonly onHistoryUp?: () => void
  readonly onHistoryDown?: () => void
  readonly placeholder?: string
  readonly multiline?: boolean
  readonly focus?: boolean
  readonly mask?: string
  readonly showCursor?: boolean
  readonly highlightPastedText?: boolean
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onSubmit?: (value: string) => void
  readonly onExit?: () => void
  readonly onExitMessage?: (show: boolean, key?: string) => void
  readonly onHistoryReset?: () => void
  readonly onClearInput?: () => void
  readonly columns: number
  readonly maxVisibleLines?: number
  readonly onImagePaste?: (
    base64Image: string,
    mediaType?: string,
    filename?: string,
    dimensions?: ImageDimensions,
    sourcePath?: string,
  ) => void
  readonly onPaste?: (text: string) => void
  readonly onIsPastingChange?: (isPasting: boolean) => void
  readonly disableCursorMovementForUpDownKeys?: boolean
  readonly disableEscapeDoublePress?: boolean
  readonly cursorOffset: number
  readonly onChangeCursorOffset: (offset: number) => void
  readonly argumentHint?: string
  readonly onUndo?: () => void
  readonly dimColor?: boolean
  readonly highlights?: TextHighlight[]
  readonly placeholderElement?: React.ReactNode
  readonly inlineGhostText?: InlineGhostText
  readonly inputFilter?: (input: string, key: Key) => string
}

export type VimTextInputProps = BaseTextInputProps & {
  readonly initialMode?: VimMode
  readonly onModeChange?: (mode: VimMode) => void
}

export type VimMode = 'INSERT' | 'NORMAL'

export type BaseInputState = {
  onInput: (input: string, key: Key) => void
  renderedValue: string
  offset: number
  setOffset: (offset: number) => void
  cursorLine: number
  cursorColumn: number
  viewportCharOffset: number
  viewportCharEnd: number
  isPasting?: boolean
  pasteState?: {
    chunks: string[]
    timeoutId: ReturnType<typeof setTimeout> | null
  }
}

export type TextInputState = BaseInputState

export type VimInputState = BaseInputState & {
  mode: VimMode
  setMode: (mode: VimMode) => void
}
