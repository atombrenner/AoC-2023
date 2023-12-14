import { readLines } from '../utils/utils'

const lines = readLines('day14/example.txt')
const platform = lines.map((line) => line.split(''))
const height = platform.length
const width = platform[0].length

const print = (p: string[][]) => {
  p.forEach((l) => console.log(l.join('')))
  console.log()
}

const moveRocks = (x: number, startY: number) => {
  let y = startY

  let rockCount = 0

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

print(platform)
moveNorth()
print(platform)
moveSouth()
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
