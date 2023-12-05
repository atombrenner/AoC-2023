export type Almanac = {
  seeds: number[]
  categories: CategoryMap[]
}

export type CategoryMap = {
  rangeMaps: RangeMap[] // ranges are sorted by source ascending
}

export type RangeMap = {
  dst: number
  src: number
  len: number
}

export type Range = {
  start: number
  len: number
}

export const makeRanges = (numbers: number[]) => {
  const ranges: Range[] = []
  for (let i = 0; i < numbers.length; i += 2) {
    ranges.push({ start: numbers[i], len: numbers[i + 1] })
  }
  return ranges
}

export const parseAlmanac = (input: string): Almanac => {
  const blocks = input.split('\n\n')
  const seeds = blocks[0].split(':')[1].trim().split(' ').map(Number)
  return { seeds, categories: blocks.slice(1).map(parseCategoryMap) }
}

const parseCategoryMap = (block: string) => {
  const lines = block.split('\n')
  const rangeMaps = lines
    .slice(1)
    .map(parseRangeMap)
    .sort((a, b) => a.src - b.src)
  return { rangeMaps }
}

const parseRangeMap = (line: string) => {
  const numbers = line.split(' ').map(Number)
  return { dst: numbers[0], src: numbers[1], len: numbers[2] }
}

export const sortedRangeMaps = (rangeMaps: RangeMap[]) =>
  rangeMaps.toSorted((a, b) => a.src - b.src)

export const mapNumber = (rangeMaps: RangeMap[], n: number): number => {
  for (const map of rangeMaps) {
    if (n < map.src) return n
    if (n >= map.src && n < map.src + map.len) {
      return map.dst + (n - map.src)
    }
  }
  return n
}

export const mapSeedThroughAllCategories = (categories: CategoryMap[], seed: number) =>
  categories.reduce((n, { rangeMaps }) => mapNumber(rangeMaps, n), seed)

export const mapRange = (rangeMaps: RangeMap[], range: Range): Range[] => {
  // imagine we have a complete range map with from and to
  // we map over them and split out new ranges.
  // because the ranges are sorted, the seedRange will get smaller,
  // but can never split up.
  // once the seedRange is empty we can leave early (or continue)

  // create copy
  range = { ...range }

  const mapped: Range[] = []

  for (const map of rangeMaps) {
    if (range.start < map.src) {
      // unmapped range
      const len = Math.min(range.len, map.src - range.start)
      mapped.push({ start: range.start, len })
      range.start += len
      range.len -= len
    }
    if (range.start < map.src + map.len) {
      // mapped range
      const len = Math.min(range.len, map.len - (range.start - map.src))
      mapped.push({ start: map.dst + (range.start - map.src), len })
      range.start += len
      range.len -= len
    }
    if (range.len === 0) break
  }
  // we can have a (leftover) range that was not mapped
  if (range.len > 0) {
    mapped.push(range)
  }
  return mapped
}

export const mapSeedRangesThroughAllCategories = (categories: CategoryMap[], seedRanges: Range[]) =>
  categories.reduce(
    (ranges, { rangeMaps }) => ranges.flatMap((range) => mapRange(rangeMaps, { ...range })),
    seedRanges,
  )
