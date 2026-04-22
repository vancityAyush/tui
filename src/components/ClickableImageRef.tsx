import * as React from 'react'
import { pathToFileURL } from 'url'
import Link from '../ink/components/Link.js'
import { supportsHyperlinks } from '../ink/supports-hyperlinks.js'
import Text from '../ink/components/Text.js'

type Props = {
  imageId: number
  imagePath?: string
  backgroundColor?: string
  isSelected?: boolean
}

/**
 * Renders an image reference like [Image #1] as a clickable link.
 * When `imagePath` is supplied and the terminal supports hyperlinks,
 * the text becomes a clickable `file://` URL. Otherwise a styled text
 * fallback is rendered.
 */
export function ClickableImageRef({
  imageId,
  imagePath,
  backgroundColor,
  isSelected = false,
}: Props): React.ReactNode {
  const displayText = `[Image #${imageId}]`

  if (imagePath && supportsHyperlinks()) {
    const fileUrl = pathToFileURL(imagePath).href
    return (
      <Link
        url={fileUrl}
        fallback={
          <Text backgroundColor={backgroundColor} inverse={isSelected}>
            {displayText}
          </Text>
        }
      >
        <Text
          backgroundColor={backgroundColor}
          inverse={isSelected}
          bold={isSelected}
        >
          {displayText}
        </Text>
      </Link>
    )
  }

  return (
    <Text backgroundColor={backgroundColor} inverse={isSelected}>
      {displayText}
    </Text>
  )
}
