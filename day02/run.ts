import { sum } from '../utils/utils'
import { readFileSync } from 'fs'
import { cubeSetPower, getMinCubeSet, isGamePossible, parseGameResults } from './gamesOfCubes'

const input = readFileSync('./day02/input.txt', 'utf-8')

const games = parseGameResults(input)

const possibleGames = games.filter(isGamePossible({ red: 12, green: 13, blue: 14 }))

console.log('sum of ids of possible games', sum(possibleGames.map((g) => g.ID)))

const cubsetPowers = games.map((g) => cubeSetPower(getMinCubeSet(g.draws)))
console.log('sum of cubset powers of min cubeset', sum(cubsetPowers))
