export type Card = {
  id: number
  winning: number[] // winning numbers
  own: number[] // numbers on card
}

// extract all numbers from a string
const getNumbers = (s: string) => Array.from(s.matchAll(/\d+/g)).map((m) => Number(m[0]))

export const parseCard = (line: string): Card => {
  const [card, numbers] = line.split(': ')
  const [winning, own] = numbers.split('|')
  return {
    id: getNumbers(card)[0],
    winning: getNumbers(winning),
    own: getNumbers(own),
  }
}

export const cardPoints = (card: Card): number => {
  const winning = new Set(card.winning)
  const count = card.own.reduce((count, current) => (winning.has(current) ? count + 1 : count), 0)
  return count > 0 ? 2 ** (count - 1) : 0
}

export type MatchedCard = {
  cardId: number
  matches: number // count of matched winning numbers
}

export const matchedWinningNumbers = (card: Card): MatchedCard => {
  const winning = new Set(card.winning)
  const matches = card.own.reduce((count, current) => (winning.has(current) ? count + 1 : count), 0)
  return { cardId: card.id, matches }
}
