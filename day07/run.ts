// hand = 5 cards
// cards AKQJT98765432

import { readFileSync } from 'fs'
import { calcTotal, readHands, readHandsPart2 } from './camelCards'

const input = readFileSync('./day07/input.txt', 'utf-8').trim()

const hands = readHands(input)
console.log('total winnings', calcTotal(hands))

const hands2 = readHandsPart2(input)
console.log('total winnings with jokers', calcTotal(hands2))
