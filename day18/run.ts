import { readLines } from '../utils/utils'

const lines = readLines('day18/input.txt')

const plan = lines.map((line) => {
  const [dir, dist, color] = line.split(' ')
  return { dir, dist: Number(dist), color }
})

let x = 0
let y = 0
let minX = 0
let maxX = 0
let minY = 0
let maxY = 0

for (const { dir, dist } of plan) {
  x += dist * (dir === 'R' ? 1 : dir === 'L' ? -1 : 0)
  y += dist * (dir === 'D' ? 1 : dir === 'U' ? -1 : 0)

  maxX = Math.max(maxX, x)
  maxY = Math.max(maxY, y)
  minX = Math.min(minX, x)
  minY = Math.min(minY, y)
}
const width = maxX - minX + 2 // make the grid wider to have simpler edge checking
const height = maxY - minY + 2
console.log(`dimension ${width} x ${height}`)

const grid = new Array(width * height).fill('.')
x = 0
y = 0
for (const { dir, dist } of plan) {
  const dx = dir === 'R' ? 1 : dir === 'L' ? -1 : 0
  const dy = dir === 'D' ? 1 : dir === 'U' ? -1 : 0
  for (let i = 0; i < dist; i++) {
    y += dy
    x += dx
    grid[x - minX + (y - minY) * width] = '#'
  }
}

// fill algorithm
const pos = (x: number, y: number) => x + y * width
const isBorder = (x: number, y: number) => grid[pos(x, y)] === '#'
for (let y = 1; y < height; y++) {
  let fill = false
  for (let x = 0; x < width; x++) {
    if (fill) {
      if (isBorder(x, y)) {
        const x1 = x
        while (isBorder(x + 1, y)) x++
        // x is now on the last border
        fill = !(
          (isBorder(x1, y - 1) || isBorder(x, y - 1)) &&
          (isBorder(x1, y + 1) || isBorder(x, y + 1))
        )
      } else {
        grid[pos(x, y)] = 'X' // fill
      }
    } else {
      if (isBorder(x, y)) {
        const x1 = x
        while (isBorder(x + 1, y)) x++
        fill =
          (isBorder(x1, y - 1) || isBorder(x, y - 1)) && (isBorder(x1, y + 1) || isBorder(x, y + 1))
      }
    }
  }
}

for (let y = 0; y < height; y++) {
  console.log(grid.slice(y * width, (y + 1) * width).join(''))
}

let count = 0
for (let i = 0; i < grid.length; i++) {
  if (grid[i] === '#' || grid[i] === 'X') count++
}

console.log('cubic meter of lava', count)
