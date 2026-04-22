import { describe, expect, test } from 'bun:test'
import React from 'react'
import { PassThrough } from 'stream'
import { OrderedList, OrderedListItem } from '../src/index.js'
import { renderSync, type Instance } from '../src/ink/root.js'

function createStdout(): NodeJS.WriteStream {
  const stream = new PassThrough() as PassThrough &
    NodeJS.WriteStream & {
      isTTY: boolean
      columns: number
      rows: number
    }
  stream.isTTY = false
  stream.columns = 80
  stream.rows = 24
  return stream
}

function createStdin(): NodeJS.ReadStream {
  const stream = new PassThrough() as PassThrough &
    NodeJS.ReadStream & {
      isTTY: boolean
    }
  stream.isTTY = false
  return stream
}

describe('OrderedList', () => {
  test('renders plain text items without requiring explicit Text wrappers', async () => {
    const stdout = createStdout()
    const stdin = createStdin()
    let instance: Instance | undefined

    try {
      expect(() => {
        instance = renderSync(
          <OrderedList>
            <OrderedListItem>
              Keep global navigation and local editing focus separate.
            </OrderedListItem>
          </OrderedList>,
          {
            stdout,
            stdin,
            stderr: process.stderr,
            exitOnCtrlC: false,
            patchConsole: false,
          },
        )
      }).not.toThrow()
    } finally {
      instance?.unmount()
      instance?.cleanup()
    }
  })

  test('renders fragment-wrapped plain text without explicit Text wrappers', async () => {
    const stdout = createStdout()
    const stdin = createStdin()
    let instance: Instance | undefined

    try {
      expect(() => {
        instance = renderSync(
          <OrderedList>
            <OrderedListItem>
              <>
                Keep global navigation and local editing focus separate.
              </>
            </OrderedListItem>
          </OrderedList>,
          {
            stdout,
            stdin,
            stderr: process.stderr,
            exitOnCtrlC: false,
            patchConsole: false,
          },
        )
      }).not.toThrow()
    } finally {
      instance?.unmount()
      instance?.cleanup()
    }
  })
})
