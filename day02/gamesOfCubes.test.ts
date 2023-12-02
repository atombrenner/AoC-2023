import { describe, it, test, expect } from 'bun:test'
import { getMinCubeSet, parseGameResults } from './gamesOfCubes'

const example = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

test('parseGameResults', () => {
  const results = parseGameResults(example)
  expect(results.length).toBe(5)
  expect(results[0].ID).toBe(1)
  expect(results[0].draws).toEqual([
    { red: 4, green: 0, blue: 3 },
    { red: 1, green: 2, blue: 6 },
    { red: 0, green: 2, blue: 0 },
  ])
})

// describe('a game with 12 red 13 green and 14 blue cubes', () => {
//   it('should have 12 red cubes', () => {
// })

test('getMinCubeSet', () => {
  const results = parseGameResults(example)
  expect(getMinCubeSet(results[0].draws)).toEqual({ red: 4, green: 2, blue: 6 })
  expect(getMinCubeSet(results[1].draws)).toEqual({ red: 1, green: 3, blue: 4 })
  expect(getMinCubeSet(results[2].draws)).toEqual({ red: 20, green: 13, blue: 6 })
  expect(getMinCubeSet(results[3].draws)).toEqual({ red: 14, green: 3, blue: 15 })
  expect(getMinCubeSet(results[4].draws)).toEqual({ red: 6, green: 3, blue: 2 })
})
