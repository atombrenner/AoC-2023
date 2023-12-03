type Schematic = string[]
type DetectedNumber = { x: number; y: number; length: number; value: number }

export function* getNumbersFromLine(y: number, line: string) {
  for (const match of line.matchAll(/\d+/g)) {
    yield { y, x: match.index ?? -1, value: Number(match[0]), length: match[0].length }
  }
}

export function* getNumbersFromSchematic(schematic: string[]) {
  for (let y = 0; y < schematic.length; y++) {
    yield* getNumbersFromLine(y, schematic[y])
  }
}

export function* getPartNumbers(schematic: Schematic) {
  for (const number of getNumbersFromSchematic(schematic)) {
    if (isAdjacentToSymbol(number, schematic)) yield number.value
  }
}

export const isAdjacentToSymbol = ({ x, y, length }: DetectedNumber, schematic: string[]) => {
  const symbol = /[^\d.]/
  const slice = (line: string) =>
    line.slice(Math.max(0, x - 1), Math.min(line.length, x + length + 1))
  return (
    (x > 0 && symbol.test(schematic[y][x - 1])) ||
    (x < schematic[y].length - length && symbol.test(schematic[y][x + length])) ||
    (y > 0 && symbol.test(slice(schematic[y - 1]))) ||
    (y < schematic.length - 1 && symbol.test(slice(schematic[y + 1])))
  )
}
