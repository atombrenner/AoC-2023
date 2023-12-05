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
  for (const range of rangeMaps) {
    if (n < range.src) return n
    if (n >= range.src && n < range.src + range.len) {
      return range.dst + (n - range.src)
    }
  }
  return n
}

export const mapSeedThroughAllCategories = (categories: CategoryMap[], seed: number) =>
  categories.reduce((n, { rangeMaps }) => mapNumber(rangeMaps, n), seed)
