import { describe, expect, test } from 'bun:test'
import {
  ClickableImageRef,
  CustomSelect,
  HighlightedCode,
  HighlightedCodeFallback,
  OrderedList,
  SelectMulti,
  ansiToPng,
  ansiToSvg,
} from '../src/index.js'

describe('ported component exports are functions/objects', () => {
  test('HighlightedCode + fallback', () => {
    expect(HighlightedCode).toBeDefined()
    expect(HighlightedCodeFallback).toBeFunction()
  })

  test('CustomSelect + SelectMulti', () => {
    expect(CustomSelect).toBeFunction()
    expect(SelectMulti).toBeFunction()
  })

  test('OrderedList', () => {
    expect(OrderedList).toBeDefined()
  })

  test('ClickableImageRef', () => {
    expect(ClickableImageRef).toBeFunction()
  })

  test('ansi -> image helpers exported', () => {
    expect(ansiToSvg).toBeFunction()
    expect(ansiToPng).toBeFunction()
  })
})
