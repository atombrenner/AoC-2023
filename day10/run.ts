import { readLines } from '../utils/utils'

const lines = readLines('day10/input.txt')

type Pos = {
  x: number
  y: number
}

const Connections: Record<string, string[]> = {
  '|': Array.from('ns'),
  '-': Array.from('ew'),
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

let pos = start
let step = 0
let dir = 's' // hint: start going south
while (true) {
  console.log(`step: ${step}, x: ${pos.x}, y:${pos.y}, dir: ${dir}`)

  step++
  pos = move(pos, dirToPos[dir])
  const tile = lines[pos.y][pos.x]
  if (tile === 'S') break // found the starting tile
  dir = Connections[tile].filter((d) => d !== opposite[dir])[0]
}
console.log('farthess away step: ', step / 2)
