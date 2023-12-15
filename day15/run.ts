import { readFileSync } from 'fs'
import { sum } from '../utils/utils'

const input = 'day15/input.txt'
const steps = readFileSync(input, 'utf-8').split(',')

const hash = (step: string) => {
  let current = 0
  for (let i = 0; i < step.length; i++) {
    const code = step.charCodeAt(i)
    current += code
    current *= 17
    current %= 256
  }
  return current
}

console.log('sum of hashes', sum(steps.map(hash)))
