import { describe, it, test, expect } from 'bun:test'

const isEqualWithSmudge = (a: string, b: string): boolean => {
  // there should be only one difference:
  let diffIndex = -2
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diffIndex >= 0) return false
      diffIndex = i
    }
  }
  return true
}

test.each([
  ['...', '...'],
  ['#..', '...'],
  ['.#.', '...'],
  ['..#', '...'],
])('%o should be equal with smudge to %o', (a, b) => {
  expect(isEqualWithSmudge(a, b)).toBe(true)
})

test.each([
  ['##.', '...'],
  ['#.#', '...'],
])('%o should *not* be equal with smudge to %o', (a, b) => {
  expect(isEqualWithSmudge(a, b)).toBe(false)
})
