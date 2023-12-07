import { test, expect } from 'bun:test'
import { normalizeHand } from './camelCards'

test('normalizeCard', () => {
  expect(normalizeHand(cardValues, 'AATT8')).toEqual('EEAA8')
  expect(normalizeHand(cardValues, 'AKQJT')).toEqual('EDCBA')
})
