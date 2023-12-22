import { readLines } from '../utils/utils'
import {
  calcArea,
  getDimensions,
  getVerticals,
  parseInstructionPart1,
  parseInstructionPart2,
} from './lagoon'

const lines = readLines('day18/input.txt')

const plan1 = lines.map(parseInstructionPart1)
console.log('dimensions', getDimensions(plan1))
const area1 = calcArea(getVerticals(plan1))
console.log('cubic meter of lava for part 1', area1)

const plan2 = lines.map(parseInstructionPart2)
console.log('dimensions', getDimensions(plan2))
const area2 = calcArea(getVerticals(plan2))
console.log('cubic meter of lava for part 2', area2)
