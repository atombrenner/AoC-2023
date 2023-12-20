import { readFileSync } from 'fs'

// - find a path with minimal heat loss

const lines = readFileSync('day17/input.txt', 'utf-8').split('\n')
const heatmap: number[][] = lines.map((line) => line.split('').map(Number))
const height = heatmap.length
const width = heatmap[0].length
const maxMomentum = 10
const minMomentum = 4

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

const nextTileAddr = (addr: TileAddr, dir: TileAddr['dir']) => ({
  x: addr.x + (dir === 'right' ? 1 : dir === 'left' ? -1 : 0),
  y: addr.y + (dir === 'down' ? 1 : dir === 'up' ? -1 : 0),
  momentum: dir === addr.dir ? addr.momentum + 1 : 1,
  dir,
})

const isValidAddr = ({ x, y, momentum }: TileAddr) =>
  x >= 0 && x < width && y >= 0 && y < height && momentum <= maxMomentum

function getNeighbours(addr: TileAddr): TileAddr[] {
  const neighbours: TileAddr[] = []
  const { dir } = addr
  if (addr.momentum === 0) {
    // little hack for the starting condition where we don't have a definite direction
    neighbours.push({ x: 1, y: 0, dir: 'right', momentum: 1 })
    neighbours.push({ x: 0, y: 1, dir: 'down', momentum: 1 })
  } else if (addr.momentum < minMomentum) {
    neighbours.push(nextTileAddr(addr, addr.dir))
  } else {
    if (dir !== 'down') neighbours.push(nextTileAddr(addr, 'up'))
    if (dir !== 'left') neighbours.push(nextTileAddr(addr, 'right'))
    if (dir !== 'up') neighbours.push(nextTileAddr(addr, 'down'))
    if (dir !== 'right') neighbours.push(nextTileAddr(addr, 'left'))
  }

  return neighbours.filter(isValidAddr)
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
      console.log(tiles.size, smallestUnvisited.length) // primitive progress logging
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
