import * as React from 'react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Ansi } from '../ink/Ansi.js'
import Box from '../ink/components/Box.js'
import { NoSelect } from '../ink/components/NoSelect.js'
import Text from '../ink/components/Text.js'
import type { DOMElement } from '../ink/dom.js'
import measureElement from '../ink/measure-element.js'
import { useTheme } from './design-system/ThemeProvider.js'
import { isFullscreenEnvEnabled } from '../utils/fullscreen.js'
import sliceAnsi from '../utils/sliceAnsi.js'
import { countCharInString } from '../utils/stringUtils.js'
import { HighlightedCodeFallback } from './HighlightedCode/Fallback.js'
import { expectColorFile } from './StructuredDiff/colorDiff.js'

type Props = {
  code: string
  filePath: string
  width?: number
  dim?: boolean
  /**
   * When true the component skips native syntax highlighting and renders
   * the fallback (plain ANSI-passthrough) path. Callers that read
   * "syntax highlighting disabled" from their own config should forward
   * that flag here.
   */
  syntaxHighlightingDisabled?: boolean
}

const DEFAULT_WIDTH = 80

export const HighlightedCode = memo(function HighlightedCode({
  code,
  filePath,
  width,
  dim = false,
  syntaxHighlightingDisabled = false,
}: Props): React.ReactElement {
  const ref = useRef<DOMElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(width || DEFAULT_WIDTH)
  const [theme] = useTheme()

  const colorFile = useMemo(() => {
    if (syntaxHighlightingDisabled) return null
    const ColorFile = expectColorFile()
    if (!ColorFile) return null
    return new ColorFile(code, filePath)
  }, [code, filePath, syntaxHighlightingDisabled])

  useEffect(() => {
    if (!width && ref.current) {
      const { width: elementWidth } = measureElement(ref.current)
      if (elementWidth > 0) {
        setMeasuredWidth(elementWidth - 2)
      }
    }
  }, [width])

  const lines = useMemo(() => {
    if (colorFile === null) return null
    return colorFile.render(theme, measuredWidth, dim)
  }, [colorFile, theme, measuredWidth, dim])

  const gutterWidth = useMemo(() => {
    if (!isFullscreenEnvEnabled()) return 0
    const lineCount = countCharInString(code, '\n') + 1
    return lineCount.toString().length + 2
  }, [code])

  return (
    <Box ref={ref}>
      {lines ? (
        <Box flexDirection="column">
          {lines.map((line, i) =>
            gutterWidth > 0 ? (
              <CodeLine key={i} line={line} gutterWidth={gutterWidth} />
            ) : (
              <Text key={i}>
                <Ansi>{line}</Ansi>
              </Text>
            ),
          )}
        </Box>
      ) : (
        <HighlightedCodeFallback
          code={code}
          filePath={filePath}
          dim={dim}
          skipColoring={syntaxHighlightingDisabled}
        />
      )}
    </Box>
  )
})

function CodeLine({
  line,
  gutterWidth,
}: {
  line: string
  gutterWidth: number
}): React.ReactNode {
  const gutter = sliceAnsi(line, 0, gutterWidth)
  const content = sliceAnsi(line, gutterWidth)
  return (
    <Box flexDirection="row">
      <NoSelect fromLeftEdge>
        <Text>
          <Ansi>{gutter}</Ansi>
        </Text>
      </NoSelect>
      <Text>
        <Ansi>{content}</Ansi>
      </Text>
    </Box>
  )
}
