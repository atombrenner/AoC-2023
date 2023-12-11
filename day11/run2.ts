import { readLines, sum } from '../utils/utils'

const universe = readLines('day11/input.txt')

// find galaxies and coordinates
type Galaxy = { id: number; x: number; y: number }
const galaxies: Galaxy[] = []
for (let y = 0; y < universe.length; y++) {
  for (let x = 0; x < universe[0].length; x++) {
    if (universe[y][x] === '#') galaxies.push({ id: galaxies.length + 1, x, y })
  }
}
console.log('number of galaxies:', galaxies.length)

// modify galaxy coordinates due to expansion of universe
const expansion = 1000000 - 1 // expansionFactor - 1 (because 1 empty line is already there)

// deep copy of galaxies
const unmodifiedGalaxies = galaxies.map((g) => ({ ...g }))

// expand universe y-axis
for (let y = 0; y < universe.length; y++) {
  if (!universe[y].includes('#')) {
    // push all galaxies with g.y > y down by expansion
    for (let i = galaxies.length; i-- > 0; ) {
      if (unmodifiedGalaxies[i].y > y) galaxies[i].y += expansion
    }
  }
}

// expand universe x-axis
for (let x = 0; x < universe[0].length; x++) {
  let colIsEmpty = true
  for (let y = universe.length; y-- > 0; ) {
    if (universe[y][x] === '#') {
      colIsEmpty = false
      break
    }
  }
  if (colIsEmpty) {
    // push all galaxies with g.x > x right by expansion
    for (let i = galaxies.length; i-- > 0; ) {
      if (unmodifiedGalaxies[i].x > x) galaxies[i].x += expansion
    }
  }
}

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
