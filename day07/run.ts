// hand = 5 cards
// cards AKQJT98765432

import { readFileSync } from 'fs'
import { compareHands, readHands } from './camelCards'

const input = readFileSync('./day07/input.txt', 'utf-8').trim()
const hands = readHands(input)

// now sort hands, so that the index + 1 equals the rank
hands.sort(compareHands)

const total = hands.reduce((sum, { bid }, index) => sum + bid * (index + 1), 0)

console.log('total winnings', total)
