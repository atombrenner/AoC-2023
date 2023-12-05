import { readFileSync } from 'fs'
import {
  makeRanges,
  mapRange,
  mapSeedRangesThroughAllCategories,
  mapSeedThroughAllCategories,
  parseAlmanac,
} from './almanac'

const input = readFileSync('./day05/input.txt', 'utf-8').trim()
const almanac = parseAlmanac(input)

const mappedSeeds = almanac.seeds.map((seed) =>
  mapSeedThroughAllCategories(almanac.categories, seed),
)
console.log(mappedSeeds)
console.log('lowest location number', Math.min(...mappedSeeds))

// Part 2

const seedRanges = makeRanges(almanac.seeds)
console.log('seedRanges', seedRanges)

let rangeMaps = almanac.categories[0].rangeMaps
let mapped = seedRanges.flatMap((range) => mapRange(rangeMaps, range))
// console.log('mapped seed to soil', mapped)

rangeMaps = almanac.categories[1].rangeMaps
mapped = mapped.flatMap((range) => mapRange(rangeMaps, range))
// console.log('mapped soil to fertilizer', mapped)

rangeMaps = almanac.categories[2].rangeMaps
mapped = mapped.flatMap((range) => mapRange(rangeMaps, range))
// console.log('mapped fertilizer to water', mapped)

rangeMaps = almanac.categories[3].rangeMaps
mapped = mapped.flatMap((range) => mapRange(rangeMaps, range))
// console.log('mapped water-to-light', mapped)

rangeMaps = almanac.categories[4].rangeMaps
mapped = mapped.flatMap((range) => mapRange(rangeMaps, range))
// console.log('mapped light-to-temperature', mapped)

rangeMaps = almanac.categories[5].rangeMaps
mapped = mapped.flatMap((range) => mapRange(rangeMaps, range))
// console.log('mapped temperature-to-humidity', mapped)

rangeMaps = almanac.categories[6].rangeMaps
mapped = mapped.flatMap((range) => mapRange(rangeMaps, range))
//console.log('mapped humidity-to-location', mapped)

const mappedRanges = mapSeedRangesThroughAllCategories(almanac.categories, seedRanges)
console.log('lowest location number', Math.min(...mappedRanges.map((r) => r.start)))
