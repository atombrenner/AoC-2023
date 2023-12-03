import { test, expect } from 'bun:test'
import {
  getGearRatios,
  getGears,
  getNumbersFromLine,
  getNumbersFromSchematic,
  getPartNumbers,
  getStars,
  isAdjacent,
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
  const partNumbers = Array.from(getPartNumbers(example)).map((p) => p.value)

  expect(partNumbers).toEqual([467, 35, 633, 617, 592, 755, 664, 598])
  expect(sum(partNumbers)).toBe(4361)
})

test('getStars', () => {
  const results = Array.from(getStars(example))
  expect(results).toEqual([
    { x: 3, y: 1 },
    { x: 3, y: 4 },
    { x: 5, y: 8 },
  ])
})

test.each([
  [{ x: 5, y: 3, length: 1 }, false],
  [{ x: 4, y: 4, length: 1 }, true],
  [{ x: 6, y: 4, length: 1 }, true],
  [{ x: 7, y: 4, length: 1 }, false], // one off
  [{ x: 3, y: 5, length: 1 }, false], // one off
  [{ x: 4, y: 5, length: 1 }, true],
  [{ x: 6, y: 5, length: 1 }, true],
  [{ x: 7, y: 5, length: 1 }, false], // one off
  [{ x: 4, y: 5, length: 1 }, true],
  [{ x: 6, y: 6, length: 1 }, true],
  [{ x: 4, y: 6, length: 1 }, true],
  [{ x: 5, y: 7, length: 1 }, false],
])('is {x:5, y:5} adjacent to number %o should be %o', (number, expected) => {
  const star = { x: 5, y: 5 }
  expect(isAdjacent(star, { ...number, value: 0 })).toEqual(expected)
})

test('getGears', () => {
  const gears = Array.from(getGears(example))
  expect(gears).toEqual([
    { x: 3, y: 1, numbers: [467, 35] },
    { x: 5, y: 8, numbers: [755, 598] },
  ])
})

test('getGearRatios', () => {
  const ratios = Array.from(getGearRatios(example))
  expect(ratios).toEqual([16345, 451490])
})
