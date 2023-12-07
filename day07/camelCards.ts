import { parseLines } from '../utils/utils'

const normalizedCardValue = Object.entries({
  A: 'E',
  K: 'D',
  Q: 'C',
  J: 'B',
  T: 'A',
  // '9': ,
  // '8': ,
  // '7': ,
  // '6': ,
  // '5': ,
  // '4': ,
  // '3': ,
  // '2': ,
})

// after normalization we can do a normal string comparision of hands
export const normalizeHand = (hand: string) =>
  normalizedCardValue.reduce((hand, card) => hand.replaceAll(card[0], card[1]), hand)

// how can we detect the types?
// count/groupBy every card in a hand

export const analyzeHand = (hand: string): Record<string, number> =>
  Array.from(hand).reduce<Record<string, number>>(
    (result, card) => ({ ...result, [card]: (result[card] ?? 0) + 1 }),
    {},
  )

export const fiveOfAKind = 10
export const fourOfAKind = 9
export const fullHouse = 8
export const threeOfAKind = 7
export const twoPair = 6
export const onePair = 5
export const highCard = 4

export type HandInfo = {
  hand: string
  type: number // one of the types above,
  bid: number
}

export const getHandType = (hand: string) => {
  const analysis = analyzeHand(hand)
  const cardCounts = Object.values(analysis)
  if (cardCounts.includes(5)) return fiveOfAKind
  if (cardCounts.includes(4)) return fourOfAKind
  if (cardCounts.includes(3) && cardCounts.includes(2)) return fullHouse
  if (cardCounts.includes(3)) return threeOfAKind
  if (cardCounts.includes(2)) {
    return cardCounts.indexOf(2) !== cardCounts.lastIndexOf(2) ? twoPair : onePair
  }
  return highCard
}

export const stringCompare = new Intl.Collator().compare

export const compareHands = (a: HandInfo, b: HandInfo) =>
  a.type === b.type ? stringCompare(a.hand, b.hand) : a.type - b.type

export const readHands = (input: string): HandInfo[] =>
  parseLines(input).map((line) => {
    const [hand, bid] = line.split(' ')
    return {
      hand: normalizeHand(hand),
      bid: Number(bid),
      type: getHandType(hand),
    }
  })
