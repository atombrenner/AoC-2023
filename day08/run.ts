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

// some debugging code to analyse the data
const debug = currentNodes.map(() => ({
  lastStep: 0,
  distances: new Set<number>(),
  nodes: new Set<string>(),
}))

while (step < 1_000_000) {
  const instruction = instructions[step % instructions.length] === 'L' ? 'left' : 'right'
  currentNodes = currentNodes.map((id) => nodeMap[id][instruction])
  step += 1
  currentNodes.forEach((node, i) => {
    if (node.endsWith('Z')) {
      const info = debug[i]
      //if (info.lastStep >= 0) {
      //console.log(`node ${i} delta: ${step - info.lastStep}`)
      info.distances.add(step - info.lastStep)
      // }
      info.nodes.add(node)
      info.lastStep = step
    }
  })
}
debug.forEach((info, i) => {
  const nodes = Array.from(info.nodes.values()).join(',')
  const distances = Array.from(info.distances.values()).join(',')
  console.log(`${i}: ${nodes} : ${distances}`)
})

// it looks like we have a stable cycle pattern for each initial node in currentNodes, starting with 0

// 0: LNZ : 20569
// 1: HPZ : 18727
// 2: ZZZ : 14429
// 3: SGZ : 13201
// 4: CXZ : 18113
// 5: CFZ : 22411

// every 20569 steps node[0] hits LNZ, every 18727 node[1] hits HPZ and so on

// when will cycles synchronize and all of them hit nodes ending with z?

const syncpoint = 20569 * 18727 * 14429 * 13201 * 18113 * 22411
console.log(syncpoint) // answer too high

const cycles = [20569, 18727, 14429, 13201, 18113, 22411]

const stepIsDividableByAllCycles = (step: number) => cycles.every((c) => step % c === 0)

const maxCycle = Math.max(...cycles)
for (step = maxCycle; !stepIsDividableByAllCycles(step); step += maxCycle) {
  // console.log(step)
}

console.log('steps needed in part 2', step)
