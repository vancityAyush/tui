import React from 'react'
import { Ansi } from '../../ink/Ansi.js'
import Text from '../../ink/components/Text.js'
import { convertLeadingTabsToSpaces } from '../../utils/file.js'

type Props = {
  code: string
  filePath: string
  dim?: boolean
  skipColoring?: boolean
}

/**
 * Plain-text renderer used when the native syntax-highlighting module
 * (see `../StructuredDiff/colorDiff.ts`) is unavailable or disabled.
 * It preserves the original indentation and passes the code through
 * `<Ansi>` so any ANSI escape sequences already present in the input
 * are rendered as styles rather than shown literally.
 */
export function HighlightedCodeFallback({
  code,
  filePath: _filePath,
  dim = false,
  skipColoring: _skipColoring = false,
}: Props): React.ReactElement {
  const codeWithSpaces = convertLeadingTabsToSpaces(code)
  return (
    <Text dimColor={dim}>
      <Ansi>{codeWithSpaces}</Ansi>
    </Text>
  )
}
