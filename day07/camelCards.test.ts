import { test, expect } from 'bun:test'
import {
  analyzeHand,
  fiveOfAKind,
  fourOfAKind,
  fullHouse,
  getHandType,
  highCard,
  onePair,
  stringCompare,
  threeOfAKind,
  twoPair,
} from './camelCards'

test('analyzeHand', () => {
  expect(analyzeHand('AA887')).toEqual({ A: 2, '8': 2, '7': 1 })
  expect(analyzeHand('ABCDE')).toEqual({ A: 1, B: 1, C: 1, D: 1, E: 1 })
})

test('getHandType', () => {
  expect(getHandType('AAAAA')).toEqual(fiveOfAKind)
  expect(getHandType('2AAAA')).toEqual(fourOfAKind)
  expect(getHandType('AA222')).toEqual(fullHouse)
  expect(getHandType('89AAA')).toEqual(threeOfAKind)
  expect(getHandType('23432')).toEqual(twoPair)
  expect(getHandType('A23A4')).toEqual(onePair)
  expect(getHandType('23456')).toEqual(highCard)
})

test('stringCompare', () => {
  expect(stringCompare('A9999', 'B9999')).toBeLessThan(0)
  expect(stringCompare('B9999', 'A9999')).toBeGreaterThan(0)
})
