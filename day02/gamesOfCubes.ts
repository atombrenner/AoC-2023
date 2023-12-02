export type GameResult = {
  ID: number
  draws: CubeSet[]
}

export type CubeSet = {
  red: number
  green: number
  blue: number
}

export const parseGameResults = (input: string) =>
  input.split('\n').map((line) => {
    const [game, draws] = line.split(':')
    if (!game || !draws) throw Error('unparsable format')
    return {
      ID: Number(game.substring(5)),
      draws: draws.split(';').map(parseCubeSet),
    }
  })

const parseCubeSet = (drawInput: string): CubeSet => ({
  red: 0,
  green: 0,
  blue: 0,
  ...Object.fromEntries(
    drawInput.split(',').map((cubes) => {
      const [count, color] = cubes.trim().split(' ')
      return [color, Number(count)]
    }),
  ),
})

export const isGamePossible = (gamesCubes: CubeSet) => (game: GameResult) =>
  game.draws.every(isDrawPossible(gamesCubes))

export const isDrawPossible = (gameCubes: CubeSet) => (draw: CubeSet) =>
  draw.red <= gameCubes.red && draw.green <= gameCubes.green && draw.blue <= gameCubes.blue

export const getMinCubeSet = (draws: CubeSet[]) => {
  return {
    red: Math.max(...draws.map((draw) => draw.red)),
    green: Math.max(...draws.map((draw) => draw.green)),
    blue: Math.max(...draws.map((draw) => draw.blue)),
  } as CubeSet
}

export const cubeSetPower = ({ red, green, blue }: CubeSet) => red * green * blue
