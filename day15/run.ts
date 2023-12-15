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

// console.log('sum of hashes', sum(steps.map(hash)))

type Lens = {
  label: string
  focal: number
}

const boxes: Lens[][] = Array(256)
  .fill(0)
  .map(() => [])

const print = () => {
  boxes.forEach((box, i) => {
    if (box.length > 0) {
      console.log(`Box ${i}: ${box.map((lens) => `[${lens.label} ${lens.focal}]`).join(' ')}`)
    }
  })
}

for (const step of steps) {
  //console.log(step)
  const [label, focal] = step.split(/=|-/)
  const i = hash(label)
  if (step.endsWith('-')) {
    boxes[i] = boxes[i].filter((lens) => lens.label !== label)
  } else {
    const existingLens = boxes[i].find((lens) => lens.label === label)
    if (existingLens) {
      existingLens.focal = Number(focal)
    } else {
      boxes[i].push({ label, focal: Number(focal) }) // push means adding behind
    }
  }
  //print()
}
print()

const total = sum(
  boxes.flatMap((box, bi) => box.map((lens, li) => (bi + 1) * (li + 1) * lens.focal)),
)

console.log('total focal power', total)
