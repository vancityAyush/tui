import React from 'react'
import { Ansi, Box, Text } from '../ink.js'
import {
  segmentTextByHighlights,
  type TextHighlight,
} from '../utils/textHighlighting.js'

type Props = {
  text: string
  highlights: TextHighlight[]
}

type LinePart = {
  text: string
  highlight?: TextHighlight
}

function splitHighlightedLines(
  text: string,
  highlights: TextHighlight[],
): LinePart[][] {
  const segments = segmentTextByHighlights(text, highlights)
  const lines: LinePart[][] = [[]]

  for (const segment of segments) {
    const parts = segment.text.split('\n')
    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([])
      }

      if (part.length > 0) {
        lines[lines.length - 1]?.push({
          text: part,
          highlight: segment.highlight,
        })
      }
    })
  }

  return lines
}

export function HighlightedInput({
  text,
  highlights,
}: Props): React.ReactNode {
  const lines = React.useMemo(
    () => splitHighlightedLines(text, highlights),
    [text, highlights],
  )

  return (
    <Box flexDirection="column">
      {lines.map((lineParts, lineIndex) => (
        <Box key={lineIndex}>
          {lineParts.length === 0 ? (
            <Text> </Text>
          ) : (
            lineParts.map((part, partIndex) => (
              <Text
                key={partIndex}
                color={part.highlight?.color}
                dimColor={part.highlight?.dimColor}
                inverse={part.highlight?.inverse}
              >
                <Ansi>{part.text}</Ansi>
              </Text>
            ))
          )}
        </Box>
      ))}
    </Box>
  )
}
