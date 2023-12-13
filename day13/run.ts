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
