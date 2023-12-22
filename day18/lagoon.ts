export type Direction = 'U' | 'D' | 'L' | 'R'

export type Instruction = {
  dir: Direction
  dist: number
}

// normalized vertical
export type Vertical = {
  x: number
  y1: number // y1 < y2
  y2: number // y2 = y1 + dist
  dir: Direction
}

export function parseInstructionPart1(line: string): Instruction {
  const [dir, dist] = line.split(' ')
  return { dir: dir as Direction, dist: Number(dist) }
}

export function parseInstructionPart2(line: string): Instruction {
  const hexIndex = line.indexOf('#') + 1
  const dist = parseInt(line.slice(hexIndex, hexIndex + 5), 16)
  const dir = 'RDLU'[parseInt(line[hexIndex + 5])]
  return { dir: dir as Direction, dist: Number(dist) }
}

export function getDimensions(instructions: Instruction[]) {
  let x = 0
  let y = 0
  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0

  for (const { dir, dist } of instructions) {
    x += dist * (dir === 'R' ? 1 : dir === 'L' ? -1 : 0)
    y += dist * (dir === 'D' ? 1 : dir === 'U' ? -1 : 0)

    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
  }
  return { minX, maxX, minY, maxY }
}

export function getVerticals(instructions: Instruction[]): Vertical[] {
  let x = 0
  let y = 0

  // we exploit the fact that we know that the path going clockwise
  // else we run this twice and after the path is closed, if
  // the first vertical is upwards the paht is clockwise else counterclockwise
  const verticals: Vertical[] = []
  let lastDir = ''
  for (const { dir, dist } of instructions) {
    if (dir === 'R' || dir === 'L') {
      x = dir === 'R' ? x + dist : x - dist
      if (verticals.length > 0) {
        if (dir === 'R' && lastDir === 'D') {
          verticals[verticals.length - 1].y2 -= 1
        }
        if (dir === 'L' && lastDir === 'U') {
          verticals[verticals.length - 1].y1 += 1
        }
      }
    } else {
      const v = { x, y1: y, y2: y, dir }
      y = dir === 'D' ? y + dist : y - dist
      if (y > v.y1) {
        v.y2 = y
      } else {
        v.y1 = y
      }
      if (dir === 'D' && lastDir === 'L') {
        v.y1 += 1
      }
      if (dir === 'U' && lastDir === 'R') {
        v.y2 -= 1
      }
      verticals.push(v)
    }
    if (dir === lastDir) throw Error('repeating direction')
    lastDir = dir
  }
  // we need to close the path (works only for my test input with lat verticali up)
  if (verticals[verticals.length - 1].dir !== 'U') throw Error('unexpected input')
  if (instructions[0].dir === 'L') {
    verticals[verticals.length - 1].y1 += 1
  }

  verticals.sort((a, b) => a.x - b.x)
  return verticals
}

// returns tow vertical lists, each having the same direction
export function partitionVerticals(verticals: Vertical[]) {
  const dir = verticals[0].dir
  const partitions: [Vertical[], Vertical[]] = [[], []]
  for (const vertical of verticals) {
    partitions[vertical.dir === dir ? 0 : 1].push(vertical)
  }
  return partitions
}

export function calcArea(verticals: Vertical[]): number {
  const [first, second] = partitionVerticals(verticals)
  return first.reduce((a, v) => a + calcAreaForVertical(v, second), 0)
}

export function calcAreaForVertical(lv: Vertical, verticals: Vertical[]): number {
  // vertical must be sorted by x, lowest x first and need to have the opposite direction

  const x = lv.x
  let area = 0
  let left = [[lv.y1, lv.y2]]

  for (const v of verticals) {
    if (v.x > x) {
      const iter = left
      left = []
      for (const [y1, y2] of iter) {
        if (v.y2 < y1 || v.y1 > y2) {
          left.push([y1, y2])
          continue
        }
        if (v.y1 <= y1) {
          //       | |
          //  |  | | | | |
          //  |      | | |
          //  |        | |
          //             |
          //
          if (v.y2 >= y2) {
            area += (v.x - x + 1) * (y2 - y1 + 1)
          } else {
            area += (v.x - x + 1) * (v.y2 - y1 + 1)
            left.push([v.y2 + 1, y2])
          }
        } else {
          // |
          // |  | case 1
          // |    | case 2
          //      |
          //
          if (v.y2 < y2) {
            area += (v.x - x + 1) * (v.y2 - v.y1 + 1)
            left.push([y1, v.y1 - 1], [v.y2 + 1, y2]) // difficult, two remaining lines
            break // this vertical is completely consumed
          } else {
            area += (v.x - x + 1) * (y2 - v.y1 + 1)
            left.push([y1, v.y1 - 1]) // check other verticals, but not the newly pushed one
          }
        }
      }
    }
    if (left.length === 0) return area
  }
  throw Error('overlapping vertical not found')
}
