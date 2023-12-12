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

const cache: Record<string, number> = {}

const findArrangements = (row: Row): number => {
  const find = (springs: string, damaged: number[], groupCount: number): number => {
    if (springs.length === 0) {
      return damaged.length === 0 && groupCount === 0 ? 1 : 0
    }
    const key = [springs, damaged.join(','), groupCount].join(',')
    if (cache[key] !== undefined) return cache[key]

    let n = 0
    if ('#?'.includes(springs[0])) {
      n += find(springs.slice(1), damaged, groupCount + 1)
    }
    if ('.?'.includes(springs[0]) && (damaged[0] === groupCount || groupCount === 0)) {
      n += find(springs.slice(1), groupCount > 0 ? damaged.slice(1) : damaged, 0)
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

// console.log(Object.keys(cache).length)
