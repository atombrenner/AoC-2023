import { describe, it, test, expect } from 'bun:test'
import { calcAreaForVertical } from './lagoon'
import type { Direction, Vertical } from './lagoon'

const down = (x: number, y1: number, y2: number): Vertical => ({ x, y1, y2, dir: 'D' })

// describe('findOverlappingVertical', () => {
//   it('should throw if no overlapp is found', () => {
//     expect(() => findOverlapingVertical([], 1)).toThrow('not found')
//   })

//   it('should return first overlapping vertical', () => {
//     const verticals = [down(10, 15, 20), down(20, 5, 15), down(30, 5, 15)]
//     const found = findOverlapingVertical(verticals, 10)
//     expect(found.x).toEqual(20)
//   })
// })

describe('calcAreaForVertical', () => {
  //   0123456
  // 0 U#####D
  // 1 U.....D
  // 2 U...##D
  // 3 U...D
  // 4 U...##D
  // 5 U.....D
  // 6 U###..D
  // 7 ...U..D
  // 8 ...U##D
  it('should handle case 1', () => {
    const downVerticals: Vertical[] = [down(4, 3, 3), down(6, 0, 2), down(6, 4, 8)]
    const area = calcAreaForVertical({ x: 0, y1: 0, y2: 6, dir: 'U' }, downVerticals)
    expect(area).toEqual(3 * 7 + 1 * 5 + 3 * 7)
  })
  it('should handle case 1 with different order for verticals with same x', () => {
    const downVerticals: Vertical[] = [down(4, 3, 3), down(6, 4, 8), down(6, 0, 2)]
    const area = calcAreaForVertical({ x: 0, y1: 0, y2: 6, dir: 'U' }, downVerticals)
    expect(area).toEqual(3 * 7 + 1 * 5 + 3 * 7)
  })
  //   0123456
  // 0 ......D
  // 1 U#####D
  // 2 U.....D
  // 3 U#####D
  // 4 ......D
  it('should handle total overlap', () => {
    const downVerticals: Vertical[] = [down(6, 0, 4)]
    const area = calcAreaForVertical({ x: 0, y1: 1, y2: 3, dir: 'U' }, downVerticals)
    expect(area).toEqual(3 * 7)
  })
})
