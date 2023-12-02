import { readFileSync } from 'fs'
import { isGamePossible, parseGameResults } from './gamesOfCubes'
import { sum } from '../utils/utils'

const input = readFileSync('./day02/input.txt', 'utf-8')

const games = parseGameResults(input)

const possibleGames = games.filter(isGamePossible({ red: 12, green: 13, blue: 14 }))

console.log(sum(possibleGames.map((g) => g.ID)))
