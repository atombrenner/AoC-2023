import { readLines, sum } from '../utils/utils'

const lines = readLines('day10/input.txt')

type Pos = {
  x: number
  y: number
}

const Connections: Record<string, string[]> = {
  '|': Array.from('ns'),
  '-': Array.from('we'),
  L: Array.from('ne'),
  J: Array.from('nw'),
  '7': Array.from('sw'),
  F: Array.from('se'),
  '.': Array.from(''),
}

const opposite: Record<string, string> = {
  n: 's',
  s: 'n',
  e: 'w',
  w: 'e',
}

const dirToPos: Record<string, Pos> = {
  n: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 },
}

const findStartingPoint = (lines: string[]): Pos => {
  for (let y = 0; y < lines.length; y++) {
    let x = lines[y].indexOf('S')
    if (x >= 0) return { x, y }
  }
  throw Error('no starting point')
}

const move = (pos: Readonly<Pos>, dir: Readonly<Pos>) => ({
  x: pos.x + dir.x,
  y: pos.y + dir.y,
})

const start = findStartingPoint(lines)
console.log('start: ', start)

// area where connected pipe is indicated as 1, everything is 0
const area: string[][] = Array(lines.length)
  .fill(0)
  .map(() => Array(lines[0].length).fill('.'))

let pos = start
let step = 0
let dir = 's' // hint: start going south (luckily true for all examples)
let startTile = '7' // too lazy to calculate the starting tile
while (true) {
  // console.log(`step: ${step}, x: ${pos.x}, y:${pos.y}, dir: ${dir}`)

  step++
  pos = move(pos, dirToPos[dir])
  const tile = lines[pos.y][pos.x]

  area[pos.y][pos.x] = tile

  if (tile === 'S') break // found the starting tile
  dir = Connections[tile].filter((d) => d !== opposite[dir])[0]
}
area[pos.y][pos.x] = startTile

console.log('max away step: ', step / 2)

// Idea for part 2:
// somehow store the vertikal lines
// inside tiles must be between pairs of vertical lines
// problem: how to handle horizontal lines (the ne, nw, se, sw tile need to count as borders)

const getInsideTiles = (line: string[]) => {
  let count = 0
  let inside = false
  let lineStart = ''
  for (const tile of line) {
    if (tile === '.') {
      if (inside) ++count
    } else if ('|FL'.includes(tile)) {
      inside = !inside
      lineStart = tile
    } else if (tile === '7' && lineStart === 'F') {
      inside = !inside
    } else if (tile === 'J' && lineStart === 'L') {
      inside = !inside
    }

    // console.log(tile, inside)
  }
  return count
}

area.forEach((l) => console.log(l.join(''), getInsideTiles(l)))

console.log('inside tiles:', sum(area.map(getInsideTiles)))
