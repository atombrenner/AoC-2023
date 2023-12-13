import { readFileSync } from 'fs'
import { sum } from '../utils/utils'

const input = 'day13/input.txt'
const patterns = readFileSync(input, 'utf-8')
  .split('\n\n')
  .map((input) => input.split('\n'))

// rotate 90 degrees clock wise
const rotate = (pattern: string[]): string[] => {
  const width = pattern[0].length
  const rotated: string[] = []
  for (let x = 0; x < width; ++x) {
    rotated.push(pattern.map((line) => line[x]).join(''))
  }
  return rotated
}

// find horizontal reflection, can be reused for vertical lines after rotation
const findMirrorLine = (pattern: string[]) => {
  for (let i = 0; i < pattern.length - 1; ++i) {
    // we need to expand until we reach the end of the pattern on either side
    const stop = Math.min(i, pattern.length - i - 2)
    for (let j = 0; pattern[i - j] === pattern[i + 1 + j]; j++) {
      //if (i - j === 0 || i + 1 + j === pattern.length - 1) return i + 1
      if (j === stop) return i + 1
    }
  }
  return 0
}

const sumHorizontal = sum(patterns.map((p) => findMirrorLine(p) * 100))
const sumVertical = sum(patterns.map(rotate).map(findMirrorLine))
console.log('summarized mirror lines: ', sumHorizontal + sumVertical)

const isEqualWithSmudge = (a: string, b: string): boolean => {
  // there should be only one difference:
  let diffIndex = -2
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diffIndex >= 0) return false
      diffIndex = i
    }
  }
  return true
}

const findMirrorLineWithSmudge = (pattern: string[], prev: number) => {
  for (let i = 0; i < pattern.length - 1; ++i) {
    // we need to ignore the line from part 1
    if (i + 1 === prev) continue

    // we need to expand until we reach the end of the pattern on either side
    const stop = Math.min(i, pattern.length - i - 2)
    for (let j = 0; isEqualWithSmudge(pattern[i - j], pattern[i + 1 + j]); j++) {
      //if (i - j === 0 || i + 1 + j === pattern.length - 1) return i + 1
      if (j === stop) return i + 1
    }
  }
  return 0
}

let total = 0
for (const pattern of patterns) {
  const rotated = rotate(pattern)
  const h = findMirrorLine(pattern)
  const v = findMirrorLine(rotated)

  const hs = findMirrorLineWithSmudge(pattern, h)
  const vs = findMirrorLineWithSmudge(rotated, v)

  // console.log(`${h},${v}\n${hs},${vs}\n`)

  total += hs * 100 + vs
}

console.log('summarized mirror lines with smudge: ', total)
