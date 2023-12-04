import { parseLines, sum } from '../utils/utils'
import { readFileSync } from 'fs'
import { cardPoints, parseCard } from './winning'

const input = readFileSync('./day04/input.txt', 'utf-8')

const lines = parseLines(input)
const cards = lines.map(parseCard)
const points = cards.map(cardPoints)
console.log('sum of all points', sum(points))
