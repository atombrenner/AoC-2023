import { readLines } from '../utils/utils'
import { createHash } from 'crypto'

const lines = readLines('day14/input.txt')
const platform = lines.map((line) => line.split(''))
const height = platform.length
const width = platform[0].length

console.log()

const print = (p: string[][]) => {
  p.forEach((l) => console.log(l.join('')))
  console.log()
}

// destructive move upwards
const moveNorth = () => {
  for (let x = 0; x < width; ++x) {
    let y = 0
    while (y < height) {
      const startY = y
      let rockY = y
      while (y < height && platform[y][x] !== '#') {
        if (platform[y][x] === 'O') rockY++
        y++
      }
      for (let i = startY; i < y; i++) {
        platform[i][x] = i < rockY ? 'O' : '.'
      }
      y++
    }
  }
}

const moveWest = () => {
  for (let y = 0; y < height; ++y) {
    let x = 0
    while (x < width) {
      const startX = x
      let rockX = x
      while (x < width && platform[y][x] !== '#') {
        if (platform[y][x] === 'O') rockX++
        x++
      }
      for (let i = startX; i < x; i++) {
        platform[y][i] = i < rockX ? 'O' : '.'
      }
      x++
    }
  }
}

const moveSouth = () => {
  for (let x = 0; x < width; ++x) {
    let y = height
    while (--y > 0) {
      const startY = y
      let rockY = y
      while (y >= 0 && platform[y][x] !== '#') {
        if (platform[y][x] === 'O') rockY--
        y--
      }
      for (let i = startY; i > y; i--) {
        platform[i][x] = i > rockY ? 'O' : '.'
      }
    }
  }
}

const moveEast = () => {
  for (let y = 0; y < height; ++y) {
    let x = width
    while (x-- > 0) {
      const startX = x
      let rockX = x
      while (x >= 0 && platform[y][x] !== '#') {
        if (platform[y][x] === 'O') rockX--
        x--
      }
      for (let i = startX; i > x; i--) {
        platform[y][i] = i > rockX ? 'O' : '.'
      }
    }
  }
}

// let's test if we can detect a cycle and stop early

const hash = () => {
  const h = createHash('sha256')
  for (const line of platform) {
    for (const tile of line) {
      if (tile !== '#') h.update(tile)
    }
  }
  return h.digest('base64')
}

const hashes = new Set<string>()
const checkHash = (cycle: number) => {
  const h = hash()
  if (hashes.has(h)) {
    //console.log(`duplicate hash ${h} found in cycle ${cycle}`)
    return h
  }
  hashes.add(h)
  return undefined
}

let cycleHash: string | undefined
let cycleStart: number | undefined
const maxCycle = 1000000000
for (let cycle = 1; cycle <= maxCycle; cycle++) {
  moveNorth()
  moveWest()
  moveSouth()
  moveEast()

  const duplicate = checkHash(cycle)
  if (duplicate) {
    if (!cycleStart) {
      cycleStart = cycle
      cycleHash = duplicate
    } else if (duplicate === cycleHash) {
      const cycleLength = cycle - cycleStart
      console.log(`cycle starts at ${cycleStart} and repeats every ${cycleLength}`)
      const forwardTo = cycle + Math.floor((maxCycle - cycle) / cycleLength) * cycleLength
      console.log(`fast forwarding to ${forwardTo}`)
      cycle = forwardTo
    }
  }
}

let load = 0
for (let y = 0; y < height; ++y) {
  for (let x = 0; x < width; ++x) {
    if (platform[y][x] === 'O') {
      load += height - y
    }
  }
}

console.log('total load on north', load)
