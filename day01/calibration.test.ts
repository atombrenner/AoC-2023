import { test, expect } from 'bun:test'
import { calibrationValueFromLine, getSumOfCalibrationValues } from './calibration'

test('getSumOfCalibrationValues', () => {
  const example = '1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet'

  expect(getSumOfCalibrationValues(example)).toBe(142)
})

test.each([
  ['1a2', 12],
  ['n3f5a8', 38],
  ['n7s', 77],
  // -- spelled out digits
  ['two1nine', 29],
  ['eightwothree', 83],
  ['abcone2threexyz', 13],
  ['xtwone3four', 24],
  ['4nineeightseven2', 42],
  ['zoneight234', 14],
  ['7pqrstsixteen', 76],
])('calibrationValueFromLine %o should be %o', (line, expectedValue) => {
  expect(calibrationValueFromLine(line)).toBe(expectedValue)
})
