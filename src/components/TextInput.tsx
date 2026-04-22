import chalk from 'chalk'
import React from 'react'
import { useClipboardImageHint } from '../hooks/useClipboardImageHint.js'
import { useTextInput } from '../hooks/useTextInput.js'
import { Box, color, useTerminalFocus, useTheme } from '../ink.js'
import type { BaseTextInputProps } from '../types/textInputTypes.js'
import { BaseTextInput } from './BaseTextInput.js'

export type Props = BaseTextInputProps

const identity = (value: string): string => value

export default function TextInput(props: Props): React.ReactNode {
  const [theme] = useTheme()
  const isTerminalFocused = useTerminalFocus()

  useClipboardImageHint(isTerminalFocused, Boolean(props.onImagePaste))

  const invert = isTerminalFocused ? chalk.inverse : identity
  const textInputState = useTextInput({
    value: props.value,
    onChange: props.onChange,
    onSubmit: props.onSubmit,
    onExit: props.onExit,
    onExitMessage: props.onExitMessage,
    onHistoryReset: props.onHistoryReset,
    onHistoryUp: props.onHistoryUp,
    onHistoryDown: props.onHistoryDown,
    onClearInput: props.onClearInput,
    focus: props.focus,
    mask: props.mask,
    multiline: props.multiline,
    cursorChar: props.showCursor ? ' ' : '',
    highlightPastedText: props.highlightPastedText,
    invert,
    themeText: color('text', theme),
    columns: props.columns,
    maxVisibleLines: props.maxVisibleLines,
    onImagePaste: props.onImagePaste,
    disableCursorMovementForUpDownKeys:
      props.disableCursorMovementForUpDownKeys,
    disableEscapeDoublePress: props.disableEscapeDoublePress,
    externalOffset: props.cursorOffset,
    onOffsetChange: props.onChangeCursorOffset,
    inputFilter: props.inputFilter,
    inlineGhostText: props.inlineGhostText,
    dim: chalk.dim,
  })

  return (
    <Box>
      <BaseTextInput
        {...props}
        inputState={textInputState}
        terminalFocus={isTerminalFocused}
        invert={invert}
      />
    </Box>
  )
}

export { TextInput }
