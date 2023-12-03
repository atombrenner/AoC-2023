import { test, expect } from 'bun:test'
import {
  getNumbersFromLine,
  getNumbersFromSchematic,
  getPartNumbers,
  isAdjacentToSymbol,
} from './schematic'
import { parseLines, sum } from '../utils/utils'

const example = parseLines(`
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`)

test('getNumbersFromLine', () => {
  const results = getNumbersFromLine(47, '467..11..5')
  expect(Array.from(results)).toEqual([
    { value: 467, x: 0, y: 47, length: 3 },
    { value: 11, x: 5, y: 47, length: 2 },
    { value: 5, x: 9, y: 47, length: 1 },
  ])
})

test('getNumbersFromSchematic', () => {
  const results = getNumbersFromSchematic(example)
  const materializedResults = Array.from(results)

  expect(materializedResults.map((r) => r.value)).toEqual([
    467, 114, 35, 633, 617, 58, 592, 755, 664, 598,
  ])
  expect(materializedResults.at(-1)).toEqual({ x: 5, y: 9, value: 598, length: 3 })
  expect(materializedResults.at(1)).toEqual({ x: 5, y: 0, value: 114, length: 3 })
})

test('isAdjacentToSymbol', () => {
  const miniExample = [
    // prettier-ignore
    '....',
    '.12.',
    '....',
  ]
  const numbers = Array.from(getNumbersFromSchematic(miniExample))
  expect(isAdjacentToSymbol(numbers[0], miniExample)).toBeFalse()

  expect(isAdjacentToSymbol({ x: 0, y: 0, length: 3, value: 467 }, example)).toBe(true)
  expect(isAdjacentToSymbol({ x: 5, y: 0, length: 3, value: 114 }, example)).toBe(false)
})

test('getPartNumbers', () => {
  const partNumbers = Array.from(getPartNumbers(example))

  expect(partNumbers).toEqual([467, 35, 633, 617, 592, 755, 664, 598])
  expect(sum(partNumbers)).toBe(4361)
})
