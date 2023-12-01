import { readFileSync } from 'fs'
import { getSumOfCalibrationValues } from './calibration'

const text = readFileSync('./day01/input.txt', 'utf-8')
console.log(`sum of calibration values is ${getSumOfCalibrationValues(text)}`)
