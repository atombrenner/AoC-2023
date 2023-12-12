import { readLines, sum } from '../utils/utils'
import assert from 'assert'

const lines = readLines('day12/input.txt')

type Row = {
  springs: string
  damaged: number[]
}

const rows = lines.map((line) => {
  const [springs, groups] = line.split(' ')
  return { springs, damaged: groups.split(',').map(Number) }
})

const getDamaged = (springs: string): number[] => {
  const groups = [0]
  for (const c of springs) {
    if (c === '#') groups[groups.length - 1] += 1
    else if (groups[groups.length - 1] > 0) groups.push(0)
  }
  if (groups[groups.length - 1] === 0) groups.pop()
  return groups
}
assert.deepStrictEqual(getDamaged('.###.#.#'), [3, 1, 1])
assert.deepStrictEqual(getDamaged('.###.#.#.'), [3, 1, 1])
assert.deepStrictEqual(getDamaged('###.#.#.'), [3, 1, 1])

const getDamagedFromBits = (bits: number): number[] => {
  const groups = [0]
  while (bits > 0) {
    if ((bits & 1) === 1) groups[groups.length - 1] += 1
    else if (groups[groups.length - 1] > 0) groups.push(0)
    bits >>= 1
  }
  if (groups[groups.length - 1] === 0) groups.pop()
  return groups
}

// bit 0 is on the right
Number.parseInt('111011', 2)
assert.deepStrictEqual(getDamagedFromBits(parseInt('10101110', 2)), [3, 1, 1])
assert.deepStrictEqual(getDamagedFromBits(parseInt('010101110', 2)), [3, 1, 1])
assert.deepStrictEqual(getDamagedFromBits(parseInt('1110011001', 2)), [1, 2, 3])

const isEqual = (a: number[], b: number[]) => a.length === b.length && a.every((n, i) => n === b[i])
assert(isEqual([], []))
assert(isEqual([1, 2], [1, 2]))
assert(!isEqual([1, 2], [1, 1]))
assert(!isEqual([1, 2], [1, 2, 3]))

const findArrangements = (row: Row): number => {
  let arrangements = 0
  // brute force idea:
  // mutate all unknowns, then count groups and compare
  // an improvement could be to work leftwards and skipp impossible groupings

  // we could use bitset
  // 1 equals a damaged spring
  // we can count bit groups by bitwise and
  // we can mask the known bits

  // ???.###
  // 1110000 mask
  // 0000111 start

  // find ? positions
  const unknowns: number[] = []
  let damagedBits = 0
  for (let i = 0; i < row.springs.length; ++i) {
    if (row.springs[i] === '?') unknowns.push(i)
    if (row.springs[i] === '#') damagedBits += 2 ** i
  }

  const permutationCount = 2 ** unknowns.length
  for (let bits = 0; bits < permutationCount; bits++) {
    let permutation = damagedBits

    // map bits to questionmaks
    for (let i = 0; i < unknowns.length; i++) {
      if (bits & (2 ** i)) permutation |= 2 ** unknowns[i]
    }

    if (isEqual(getDamagedFromBits(permutation), row.damaged)) {
      arrangements += 1
    }
  }

  return arrangements
}

// for (let i = 0; i < lines.length; i++) {
//   console.log(lines[i], findArrangements(rows[i]))
// }

console.log('sum of arrangements: ', sum(rows.map(findArrangements)))
