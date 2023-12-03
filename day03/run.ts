import { parseLines, sum } from '../utils/utils'
import { readFileSync } from 'fs'
import { getPartNumbers } from './schematic'

const input = readFileSync('./day03/input.txt', 'utf-8')

const partNumbers = Array.from(getPartNumbers(parseLines(input)))

console.log('sum of all part numbers', sum(partNumbers))
