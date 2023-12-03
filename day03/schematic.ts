type Schematic = string[]
type DetectedNumber = { x: number; y: number; length: number; value: number }
type Star = { x: number; y: number }

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
    if (isAdjacentToSymbol(number, schematic)) yield number
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

export function* getStars(schematic: Schematic) {
  for (let y = 0; y < schematic.length; y++) {
    for (const match of schematic[y].matchAll(/\*/g)) {
      yield { y, x: match.index ?? -1 }
    }
  }
}

export function* getGears(schematic: Schematic) {
  const partNumbers = Array.from(getPartNumbers(schematic))

  for (const star of getStars(schematic)) {
    const numbers = getAdjacentNumbers(star, partNumbers)
    if (numbers.length === 2) yield { ...star, numbers }
  }
}

export function* getGearRatios(schematic: Schematic) {
  for (const gear of getGears(schematic)) {
    yield gear.numbers[0] * gear.numbers[1]
  }
}

export const getAdjacentNumbers = (star: Star, partNumbers: DetectedNumber[]) => {
  // brute force, just scan through all numbers without leveraging the fact that they are sorted by y

  const numbers: number[] = []
  for (const number of partNumbers) {
    if (isAdjacent(star, number)) numbers.push(number.value)
  }
  return numbers
}

export const isAdjacent = (star: Star, number: DetectedNumber): boolean => {
  if (star.y < number.y - 1 || star.y > number.y + 1) return false
  if (star.x < number.x - 1 || star.x > number.x + number.length) return false
  return true
}
