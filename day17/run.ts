import { readFileSync } from 'fs'

// - find a path with minimal heat loss

const lines = readFileSync('day17/example.txt', 'utf-8').split('\n')
const heatmap: number[][] = lines.map((line) => line.split('').map(Number))
const height = heatmap.length
const width = heatmap[0].length
const maxMomentum = 3

// TileAddress could be just a number for fast array lookup, without the need to generate string keys
// y * width * maxMomentum * 4 + x * maxMomentum * 4 + momentum + dir (0,1,2,3)
// tileaddr optimization would speedup the process by only 1s, no more time is spent in this code path
type TileAddr = { x: number; y: number; momentum: number; dir: 'up' | 'right' | 'down' | 'left' }

// have a list of tiles with heatloss and previous tile
type Tile = {
  addr: TileAddr
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
// The number of unvisited tiles is roughly constant and much smaller than then all tiles
// the tile with the smallest heatloss will always be removed
// => list of unvisited tiles with heatloss < Infinity (= touched)
// => list is always sorted (either binary search for optimal insert or just sort the array)
// => smallest heat loss is last, so we can efficiently pop() the last element
// => finding an element for updating can be done by the gobal tiles map (same instance, but two indices)

const tiles = new Map<string, Tile>()
const getTileKey = (addr: TileAddr) => [addr.x, addr.y, addr.dir, addr.momentum].join(',')
const getTileInfo = (addr: TileAddr) => {
  const key = getTileKey(addr)
  let info = tiles.get(key)
  if (!info) {
    info = { addr, heatloss: Infinity, visited: false }
    tiles.set(key, info)
  }
  return info
}

const smallestUnvisited: Tile[] = []

const newTileAddr = (
  x: number,
  y: number,
  dir: TileAddr['dir'],
  oldDir: TileAddr['dir'],
  momentum: number,
) => ({ x, y, momentum: dir === oldDir ? momentum + 1 : 1, dir })

function* getNeighbours({ x, y, momentum, dir }: TileAddr) {
  if (x > 0 && dir !== 'right' && !(dir === 'left' && momentum === maxMomentum))
    yield newTileAddr(x - 1, y, 'left', dir, momentum)

  if (x < width - 1 && dir !== 'left' && !(dir === 'right' && momentum === maxMomentum))
    yield newTileAddr(x + 1, y, 'right', dir, momentum)

  if (y > 0 && dir !== 'down' && !(dir === 'up' && momentum === maxMomentum))
    yield newTileAddr(x, y - 1, 'up', dir, momentum)

  if (y < height - 1 && dir !== 'up' && !(dir === 'down' && momentum === maxMomentum))
    yield newTileAddr(x, y + 1, 'down', dir, momentum)
}

function findPath() {
  const stopX = width - 1
  const stopY = height - 1

  const start = getTileInfo({ x: 0, y: 0, dir: 'right' as const, momentum: 0 })
  start.heatloss = 0
  smallestUnvisited.push(start)

  while (true) {
    smallestUnvisited.sort((a, b) => b.heatloss - a.heatloss)
    const current = smallestUnvisited.pop()
    if (!current) return
    current.visited = true
    if (current.addr.x === stopX && current.addr.y === stopY) return current

    if (tiles.size % 1000 === 0) {
      console.log(tiles.size) // primitive progress logging
    }

    for (const addr of getNeighbours(current.addr)) {
      const neighbour = getTileInfo(addr)
      if (neighbour.visited) continue

      const heatloss = current.heatloss + heatmap[addr.y][addr.x]
      if (heatloss < neighbour.heatloss) {
        if (neighbour.heatloss === Infinity) {
          // move to list of potential next tiles
          smallestUnvisited.push(neighbour)
        }
        neighbour.heatloss = heatloss
        neighbour.previous = current
      }
    }
  }
}

function backtracePath(endTile: Readonly<Tile> | undefined) {
  let tile = endTile
  while (tile) {
    heatmap[tile.addr.y][tile.addr.x] = 0
    tile = tile.previous
  }
}

const found = findPath()
if (!found) throw new Error('no path found')

backtracePath(found)
heatmap.forEach((row) => console.log(row.join('')))

console.log('minimum heatloss', found.heatloss)
