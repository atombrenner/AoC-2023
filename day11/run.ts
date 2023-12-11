import { readLines, sum } from '../utils/utils'

const lines = readLines('day11/input.txt')

// expand universe horizontally
const universe: string[] = []
for (const line of lines) {
  universe.push(line)
  if (!line.includes('#')) universe.push(line)
}

// expand universe vertically
for (let x = universe[0].length; x-- > 0; ) {
  let colIsEmpty = true
  for (let y = universe.length; y-- > 0; ) {
    if (universe[y][x] === '#') {
      colIsEmpty = false
      break
    }
  }
  if (colIsEmpty) {
    for (let y = universe.length; y-- > 0; ) {
      universe[y] = universe[y].substring(0, x) + '.' + universe[y].substring(x)
    }
  }
}

// universe.forEach((l) => console.log(l))
// const result = readLines('day11/example_result.txt')
// console.log(
//   'isExampleResult: ',
//   universe.every((line, i) => line === result[i]),
// )

// find galaxies and coordinates
type Galaxy = { id: number; x: number; y: number }
const galaxies: Galaxy[] = []
for (let y = 0; y < universe.length; y++) {
  for (let x = 0; x < universe[0].length; x++) {
    if (universe[y][x] === '#') galaxies.push({ id: galaxies.length + 1, x, y })
  }
}
console.log('number of galaxies:', galaxies.length)

// pair each galaxy
const pairs: [Galaxy, Galaxy][] = []
for (let i = 0; i < galaxies.length; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    pairs.push([galaxies[i], galaxies[j]])
  }
}
console.log('numbers of pairs: ', pairs.length)

// find shortest path between each pair galaxy
// must be a trick questions, because if you can only move
// from square to square you could just calculate it

const findShortestPath = (g1: Galaxy, g2: Galaxy) => Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y)

// const g5 = galaxies[5 - 1]
// const g9 = galaxies[9 - 1]
// console.log(g5, g9, findShortestPath(g5, g9))

const shortestPath = pairs.map(([g1, g2]) => findShortestPath(g1, g2))

console.log('sum of shortest path: ', sum(shortestPath))
