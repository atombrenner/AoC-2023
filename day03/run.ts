import { parseLines, sum } from '../utils/utils'
import { readFileSync } from 'fs'
import { getGearRatios, getPartNumbers } from './schematic'

const input = readFileSync('./day03/input.txt', 'utf-8')
const schematics = parseLines(input)

const partNumbers = Array.from(getPartNumbers(schematics))

console.log('sum of all part numbers"', sum(partNumbers.map((p) => p.value)))

const gearRatios = Array.from(getGearRatios(schematics))

console.log('sum of all gear ratios:', sum(gearRatios))
