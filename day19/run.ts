import { readFileSync } from 'fs'
import { Part, evaluate, parseInput } from './solution'
import { sum } from '../utils/utils'

const input = readFileSync('day19/input.txt', 'utf-8')

const { workflows, parts } = parseInput(input)

// algorithmn
// evaluate(workflows)
const isAccepted = (part: Part) => evaluate(workflows, 'in', part) === 'A'
const accepted = parts.filter(isAccepted)

console.log('part 1 sum', sum(accepted.map((p) => sum(Object.values(p)))))
