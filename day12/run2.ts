import { readLines, sum } from '../utils/utils'

const lines = readLines('day12/input.txt')

type Row = {
  springs: string
  damaged: number[]
}

const rows = lines.map((line) => {
  const [springs, groups] = line.split(' ')
  return { springs, damaged: groups.split(',').map(Number) }
})

const findArrangements = (row: Row): number => {
  const cache: Record<string, number> = {}

  const find = (springs: string, damaged: number[], matchCount: number): number => {
    if (springs.length === 0) {
      return damaged.length === 0 && matchCount === 0 ? 1 : 0
    }
    const key = [springs, damaged.join(','), matchCount].join(',')
    if (cache[key] !== undefined) return cache[key]

    let n = 0
    if (springs[0] !== '.') {
      n += find(springs.slice(1), damaged, matchCount + 1)
    }
    if (springs[0] !== '#' && (damaged[0] === matchCount || matchCount === 0)) {
      n += find(springs.slice(1), matchCount > 0 ? damaged.slice(1) : damaged, 0)
    }
    cache[key] = n
    return n
  }

  return find(Array(5).fill(row.springs).join('?') + '.', Array(5).fill(row.damaged).flat(), 0)
}

// console.log('## 2', findArrangements({ springs: '##', damaged: [2] }))
// console.log(lines[1], findArrangements(rows[1]))

// for (let i = 0; i < lines.length; i++) {
//   console.log(lines[i], findArrangements(rows[i]))
// }

console.log('sum of arrangements: ', sum(rows.map(findArrangements)))
