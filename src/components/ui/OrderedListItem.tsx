import React, {
  Children,
  Fragment,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
} from 'react'
import Box from '../../ink/components/Box.js'
import Text from '../../ink/components/Text.js'

export const OrderedListItemContext = createContext({ marker: '' })

type OrderedListItemProps = {
  children: ReactNode
}

function normalizeOrderedListChildren(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text>{child}</Text>
    }

    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return (
        <Fragment key={child.key}>
          {normalizeOrderedListChildren(child.props.children)}
        </Fragment>
      )
    }

    return child
  })
}

export function OrderedListItem({
  children,
}: OrderedListItemProps): React.ReactNode {
  const { marker } = useContext(OrderedListItemContext)
  const content = normalizeOrderedListChildren(children)

  return (
    <Box gap={1}>
      <Text dimColor>{marker}</Text>
      <Box flexDirection="column">{content}</Box>
    </Box>
  )
}
