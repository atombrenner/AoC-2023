import { readFileSync } from 'fs'
import { mapNumber, mapSeedThroughAllCategories, parseAlmanac, sortedRangeMaps } from './almanac'

const input = readFileSync('./day05/input.txt', 'utf-8').trim()
const almanac = parseAlmanac(input)

const mapped = almanac.categories.reduce((n, { rangeMaps }) => mapNumber(rangeMaps, n), 79)
console.log(mapped)

// const rangeMaps = sortedRangeMaps([
//   { dst: 50, src: 98, len: 2 },
//   { dst: 52, src: 50, len: 48 },
// ])
//console.dir(rangeMaps)

const mappedSeeds = almanac.seeds.map((seed) =>
  mapSeedThroughAllCategories(almanac.categories, seed),
)
console.log(mappedSeeds)
console.log(Math.min(...mappedSeeds))
