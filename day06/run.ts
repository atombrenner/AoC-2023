type Race = { time: number; distance: number }

// https://adventofcode.com/2023/day/6

// Input
// Time:        35     93     73     66
// Distance:   212   2060   1201   1044

const input: Race[] = [
  { time: 35, distance: 212 },
  { time: 93, distance: 2060 },
  { time: 73, distance: 1201 },
  { time: 66, distance: 1044 },
]

const example: Race[] = [
  { time: 7, distance: 9 },
  { time: 15, distance: 40 },
  { time: 30, distance: 200 },
]

// t is race time, x is button press time
const calcDistance = (t: number, x: number) => (t - x) * x

// problem sounds it could solved mathmatically (quadratic equation)
// f(x) = (t - x) * x | for which x is f(x) > distance
// tx - x**2 > d
// that is similar to what zero points exist for
// -x**2 + tx - d > 0
const zeroPoints = ({ time: t, distance: d }: Race) => {
  const sqrt = Math.sqrt(t ** 2 - 4 * d)
  const x1 = (-t + sqrt) / -2
  const x2 = (-t - sqrt) / -2
  console.log([x1, x2])
  return [x1, x2] as const
}

const possibilities = ([x1, x2]: readonly [number, number]) => {
  const i1 = Math.floor(x1) + 1 // smallest integer > x1
  const i2 = Math.ceil(x2) - 1 // greatest integer < x2
  console.log([i1, i2])
  return i2 - i1 + 1
}

const result = input.map(zeroPoints).map(possibilities)
console.log(`possibilities ${result} multiplied is ${result.reduce((a, c) => a * c, 1)}`)

// Part2
// only one race
const race = {
  time: 35_93_73_66,
  distance: 212_2060_1201_1044,
}
console.log('long rance possibilities', possibilities(zeroPoints(race)))
