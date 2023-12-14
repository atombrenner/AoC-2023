import { readLines } from '../utils/utils'

const lines = readLines('day14/input.txt')
const platform = lines.map((line) => line.split(''))
const height = platform.length
const width = platform[0].length

const print = (p: string[][]) => {
  p.forEach((l) => console.log(l.join('')))
  console.log()
}

print(platform)

const moveRocks = (x: number, startY: number) => {
  let rockCount = 0
  let y = startY
  while (y < height && platform[y][x] !== '#') {
    if (platform[y][x] === 'O') rockCount++
    y++
  }
  for (let i = 0; i < y - startY; i++) {
    platform[startY + i][x] = i < rockCount ? 'O' : '.'
  }

  return y
}

// destructive move upwards
for (let x = 0; x < width; ++x) {
  let y = 0
  while (y < height) {
    y = moveRocks(x, y) + 1
  }
}

print(platform)

let load = 0
for (let y = 0; y < height; ++y) {
  for (let x = 0; x < width; ++x) {
    if (platform[y][x] === 'O') {
      load += height - y
    }
  }
}

console.log('total load on north', load)
