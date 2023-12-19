import { readFileSync } from 'fs'

// - find a way with minimal heat loss
// - number of visited tiles is not an explicit constraint, but minimizing
//   numbers of visited tiles would also impact the heat loss
// - heatloss = sum of heatloss of all visited tiles
// - after each step we have three possibilities
//   - forward, left, right
//   - can't move outside
// - maybe we can stop exploring a path, if it is much worse than anohter, maybe farther away an higher heat loss
// - bruteforcing seems impossible, but maybe if we detect cycles, like paths already explored

const lines = readFileSync('day17/input.txt', 'utf-8').split('\n')
const grid: number[][] = lines.map((line) => line.split('').map(Number))
const height = grid.length
const width = grid[0].length
console.log(width * height * 12)

type Tile = { x: number; y: number; momentum: number; dir: 'up' | 'right' | 'down' | 'left' }

// have a list of tiles with heatloss and previous tile
type TileInfo = {
  tile: Tile
  previous?: Tile
  heatloss: number
  visited: boolean
}

// instead of preparing all tiles in advance, we have
// a list of tiles filled during discovery
// and remove them once they are visited
// with the additional steps info it could be that an array of tiles gets to large,
// like width * height * 3 * 4  which would be actualy ok  as it grows only by a factor of 7
// I believe some tiles are never visited => not true, only a minimal number (2) is not visited in normal case

const tiles = new Map<string, TileInfo>()
const getTileKey = (tile: Tile) => [tile.x, tile.y, tile.dir, tile.momentum].join(',')
const getTileInfo = (tile: Tile) => {
  const key = getTileKey(tile)
  let info = tiles.get(key)
  if (!info) {
    info = { tile, heatloss: Infinity, visited: false }
    tiles.set(key, info)
    if (tiles.size % 1000 === 0) console.log('size', tiles.size)
  }
  return info
}

function findUnvisitedTileWithSmallestHeatloss() {
  let heatloss = Infinity
  let smallestTile: TileInfo | undefined = undefined
  for (const info of tiles.values()) {
    if (!info.visited && info.heatloss < heatloss) {
      heatloss = info.heatloss
      smallestTile = info
    }
  }
  return smallestTile
}

// neighbour detection must include rules
// tile must include information about how many steps were done in this direction
// maybe {x, y, steps: 'e'|'ee'|'eee'}

const newTile = (
  x: number,
  y: number,
  dir: Tile['dir'],
  oldDir: Tile['dir'],
  momentum: number,
) => ({ x, y, momentum: dir === oldDir ? momentum + 1 : 1, dir })

function* getNeighbours({ x, y, momentum, dir }: Tile) {
  if (x > 0 && dir !== 'right' && !(dir === 'left' && momentum === 3))
    yield newTile(x - 1, y, 'left', dir, momentum)

  if (x < width - 1 && dir !== 'left' && !(dir === 'right' && momentum === 3))
    yield newTile(x + 1, y, 'right', dir, momentum)

  if (y > 0 && dir !== 'down' && !(dir === 'up' && momentum === 3))
    yield newTile(x, y - 1, 'up', dir, momentum)

  if (y < height - 1 && dir !== 'up' && !(dir === 'down' && momentum === 3))
    yield newTile(x, y + 1, 'down', dir, momentum)
}

//tiles[0][0].heatloss = 0
let current = getTileInfo({ x: 0, y: 0, dir: 'right' as const, momentum: 0 })
current.heatloss = 0
const stopX = width - 1
const stopY = height - 1

while (true) {
  for (const tile of getNeighbours(current.tile)) {
    const neighbour = getTileInfo(tile)
    if (neighbour.visited) continue
    const heatloss = current.heatloss + grid[tile.y][tile.x]
    if (heatloss < neighbour.heatloss) {
      neighbour.heatloss = heatloss
      neighbour.previous = current.tile
    }
  }
  current.visited = true
  // console.log(current)
  if (current.tile.x === stopX && current.tile.y === stopY) break
  const next = findUnvisitedTileWithSmallestHeatloss()
  if (!next) break
  current = next
}

function backtracePath(tile: Tile) {
  const path: Tile[] = [tile]
  while (true) {
    grid[tile.y][tile.x] = 0
    const { previous } = getTileInfo(tile)
    if (!previous) break
    path.push(previous)
    tile = previous
  }
  return path
}

backtracePath(current.tile)
grid.forEach((row) => console.log(row.join('')))

console.log('minimum heatloss', current.heatloss)
