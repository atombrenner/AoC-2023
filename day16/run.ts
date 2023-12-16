// follow tip of light
// create offsprings on splitters
// once the beam leaves the grid or we detect a loop (same tile entered from the same direction) we stop
// follow offsprings
// while following, mark each tile as energized

import { readFileSync } from 'fs'

// I am tired of parsing lines, so lets try doing everything with offset manipulation this time

const input = readFileSync('day16/input.txt', 'utf-8').split('\n')
const width = input[0].length
const grid = input.join('')

const maxWidth = 1000
const up = -width
const down = width
const left = -1
const right = 1

console.log(width)
console.assert(width < maxWidth)

// if we have only an offset, how can we detect leaving the grid?

const move = (pos: number, dir: number) => {
  if (dir === left && pos % width === 0) return -1
  const next = pos + dir
  if (next < 0 || next >= grid.length) return -1
  if (dir === right && next % width === 0) return -1
  return next
}

const energized = new Set<number>()
const cycle = new Set<number>()

const beams = [[0, right]]
for (let i = 0; i < beams.length; ++i) {
  let [pos, dir] = beams[i]
  while (pos >= 0) {
    const posAndDir = pos * maxWidth + dir
    if (cycle.has(posAndDir)) break
    cycle.add(posAndDir)
    energized.add(pos)
    // console.log(pos, dir)
    switch (grid[pos]) {
      case '\\':
        switch (dir) {
          case left:
            dir = up
            break
          case right:
            dir = down
            break
          case up:
            dir = left
            break
          case down:
            dir = right
            break
        }
        break
      case '/':
        switch (dir) {
          case left:
            dir = down
            break
          case right:
            dir = up
            break
          case up:
            dir = right
            break
          case down:
            dir = left
            break
        }
        break
      case '-':
        if (dir === up || dir === down) {
          dir = left
          beams.push([pos, right])
        }
        break
      case '|':
        if (dir === left || dir === right) {
          dir = up
          beams.push([pos, down])
        }
        break
    }
    pos = move(pos, dir)
  }
}

console.log('energized tiles', energized.size)
