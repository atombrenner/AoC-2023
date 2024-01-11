import { readFileSync } from 'fs'
import { parseInput, pushButton } from './solution'

const input = readFileSync('day20/input.txt', 'utf-8')
const modules = parseInput(input)

let lowCount = 0
let highCount = 0
for (let i = 0; i < 1000; ++i) {
  const [low, high] = pushButton(modules)
  lowCount += low
  highCount += high
}
console.log('pulse count', lowCount * highCount)
