import { groupBy, readLines } from '../utils/utils'

const lines = readLines('day08/input.txt')

const instructions = lines[0]
console.log(instructions)

type Node = {
  id: string
  left: string
  right: string
}

const parseNodeList = (lines: string[]) =>
  lines.slice(2).map((line) => {
    const matches = Array.from(line.matchAll(/[A-Z]{3}/g))
    return { id: matches[0][0], left: matches[1][0], right: matches[2][0] }
  })

const nodeMap: Record<string, Node> = groupBy(parseNodeList(lines), (node) => node.id)

// follow instructions and count
let step = 0
let currentNode = 'AAA'
while (currentNode !== 'ZZZ') {
  switch (instructions[step % instructions.length]) {
    case 'L':
      currentNode = nodeMap[currentNode].left
      break
    case 'R':
      currentNode = nodeMap[currentNode].right
      break
    default:
      throw Error('unexpected instruction')
  }
  step += 1
}
console.log('steps needed', step)
