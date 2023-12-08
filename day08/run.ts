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
    const matches = Array.from(line.matchAll(/\w{3}/g))
    return { id: matches[0][0], left: matches[1][0], right: matches[2][0] }
  })

const nodeMap: Record<string, Node> = groupBy(parseNodeList(lines), (node) => node.id)

// follow instructions and count
let step = 0
let currentNode = 'AAA'
while (currentNode !== 'ZZZ') {
  const instruction = instructions[step % instructions.length] === 'L' ? 'left' : 'right'
  currentNode = nodeMap[currentNode][instruction]
  step += 1
}
console.log('steps needed in part 1', step)

step = 0
let currentNodes = Object.keys(nodeMap).filter((id) => id.endsWith('A'))
// this solutions runs forever, even it solved the example of part 2
// while (!currentNodes.every((id) => id.endsWith('Z'))) {
//   const instruction = instructions[step % instructions.length] === 'L' ? 'left' : 'right'
//   currentNodes = currentNodes.map((id) => nodeMap[id][instruction])
//   step += 1
// }

//console.log('steps needed in part 2', step)
