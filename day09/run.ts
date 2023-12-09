import { readLines, sum } from '../utils/utils'

const lines = readLines('day09/input.txt')
const sequences = lines.map((line) => line.split(' ').map(Number))

const makeDiff = (seq: number[]): number[] => {
  const diffSeq: number[] = []
  for (let i = 1; i < seq.length; i++) {
    diffSeq.push(seq[i] - seq[i - 1])
  }
  return diffSeq
}

const isZeroSeq = (seq: number[]) => seq.every((n) => n === 0)

const predictNext = (seq: number[]): number => {
  if (seq.length <= 1) throw Error('unpredictable')
  const prediction = isZeroSeq(seq) ? seq.at(-1)! : seq.at(-1)! + predictNext(makeDiff(seq))
  console.log(seq.join(' ') + ' | ' + prediction)
  return prediction
}

// console.log(predictNext(sequences[0]))

console.log('sum of all next values: ', sum(sequences.map(predictNext)))
