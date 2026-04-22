import React from 'react'
import { renderPlaceholder } from '../hooks/renderPlaceholder.js'
import { usePasteHandler } from '../hooks/usePasteHandler.js'
import { useDeclaredCursor } from '../ink/hooks/use-declared-cursor.js'
import { Ansi, Box, Text, useInput } from '../ink.js'
import type { BaseInputState, BaseTextInputProps } from '../types/textInputTypes.js'
import type { TextHighlight } from '../utils/textHighlighting.js'
import { HighlightedInput } from './HighlightedInput.js'

type BaseTextInputComponentProps = BaseTextInputProps & {
  inputState: BaseInputState
  children?: React.ReactNode
  terminalFocus: boolean
  highlights?: TextHighlight[]
  invert?: (text: string) => string
  hidePlaceholderText?: boolean
}

export function BaseTextInput({
  inputState,
  children,
  terminalFocus,
  invert,
  hidePlaceholderText,
  ...props
}: BaseTextInputComponentProps): React.ReactNode {
  const {
    onInput,
    renderedValue,
    cursorLine,
    cursorColumn,
    viewportCharOffset,
    viewportCharEnd,
  } = inputState

  const cursorRef = useDeclaredCursor({
    line: cursorLine,
    column: cursorColumn,
    active: Boolean(props.focus && props.showCursor && terminalFocus),
  })

  const { wrappedOnInput, isPasting } = usePasteHandler({
    onPaste: props.onPaste,
    onInput: (input, key) => {
      if (isPasting && key.return) {
        return
      }
      onInput(input, key)
    },
    onImagePaste: props.onImagePaste,
  })

  React.useEffect(() => {
    props.onIsPastingChange?.(isPasting)
  }, [isPasting, props.onIsPastingChange])

  const { showPlaceholder, renderedPlaceholder } = renderPlaceholder({
    placeholder: props.placeholder,
    value: props.value,
    showCursor: props.showCursor,
    focus: props.focus,
    terminalFocus,
    invert,
    hidePlaceholderText,
  })

  useInput(wrappedOnInput, { isActive: props.focus })

  const commandWithoutArgs =
    props.value.length === 0 ||
    props.value.trim().indexOf(' ') === -1 ||
    props.value.endsWith(' ')
  const showArgumentHint = Boolean(
    props.argumentHint &&
      props.value &&
      commandWithoutArgs &&
      props.value.startsWith('/'),
  )

  const filteredHighlights = props.highlights
    ?.filter(highlight => {
      if (!props.showCursor) {
        return true
      }
      return (
        highlight.dimColor ||
        props.cursorOffset < highlight.start ||
        props.cursorOffset >= highlight.end
      )
    })
    .filter(
      highlight =>
        highlight.end > viewportCharOffset &&
        highlight.start < viewportCharEnd,
    )
    .map(highlight => ({
      ...highlight,
      start: Math.max(highlight.start, viewportCharOffset) - viewportCharOffset,
      end: Math.min(highlight.end, viewportCharEnd) - viewportCharOffset,
    }))

  let content: React.ReactNode
  if (showPlaceholder && props.placeholderElement) {
    content = props.placeholderElement
  } else if (showPlaceholder && renderedPlaceholder !== undefined) {
    content = <Ansi>{renderedPlaceholder}</Ansi>
  } else if (filteredHighlights && filteredHighlights.length > 0) {
    content = (
      <HighlightedInput text={renderedValue} highlights={filteredHighlights} />
    )
  } else {
    content = <Ansi>{renderedValue}</Ansi>
  }

  return (
    <Box ref={cursorRef} flexDirection="column">
      <Box>
        {content}
        {showArgumentHint ? (
          <Text dimColor>{props.argumentHint}</Text>
        ) : null}
      </Box>
      {children}
    </Box>
  )
}
