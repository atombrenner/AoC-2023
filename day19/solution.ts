import { sum } from '../utils/utils'

export type Category = 'x' | 'm' | 'a' | 's'

export type Part = Record<Category, number>

export type PartRange = Record<Category, readonly [number, number]>

export type Result = 'A' | 'R'

export type Workflow = {
  name: string
  rules: Rule[]
}

export type Rule = {
  condition?: Condition
  result: Result | Workflow['name']
}

export type Condition = {
  category: Category
  operator: '<' | '>'
  value: number
}

export function parseInput(input: string) {
  const workflows: Record<string, Workflow> = {}
  const iterator = input.split('\n')[Symbol.iterator]()
  for (const line of iterator) {
    if (!line) break // empty line separates workflows from parts
    const workflow = parseWorkflow(line)
    workflows[workflow.name] = workflow
  }
  const parts: Part[] = []
  for (const line of iterator) {
    parts.push(parsePart(line))
  }
  return { workflows, parts }
}

function parseWorkflow(line: string): Workflow {
  const match = line.match(/^(\w+)\{(.+)}/)
  if (!match) throw Error('invalid workflow')
  const name = match[1]
  const rules = match[2].split(',').map(parseRule)
  return { name, rules }
}

function parseRule(rule: string): Rule {
  const [condition, result] = rule.split(':')
  if (!result) return { result: condition } // always true
  return { condition: parseCondition(condition), result }
}

function parseCondition(condition: string): Condition {
  const match = condition.match(/^(\w)(<|>)(\d+)/)
  if (!match) throw Error('illegal workflow condition')
  return { category: match[1], operator: match[2], value: Number(match[3]) } as Condition
}

function parsePart(line: string): Part {
  const part = {} as Part
  for (const match of line.matchAll(/(\w)=(\d+)/g)) {
    part[match[1] as Category] = Number(match[2])
  }
  return part
}

export const always = () => true
export const less = (category: Category, value: number) => (part: Part) => part[category] < value
export const greater = (category: Category, value: number) => (part: Part) => part[category] > value

export function evaluate(workflows: Record<string, Workflow>, name: string, part: Part): Result {
  for (const { condition, result } of workflows[name].rules) {
    //if (!condition(part)) continue // if condition is a function
    if (condition) {
      const { category, operator, value } = condition
      if (operator === '<' && !(part[category] < value)) continue
      if (operator === '>' && !(part[category] > value)) continue
    }

    if (result === 'A' || result === 'R') return result
    // return result(part) // if result is a function
    if (result in workflows) return evaluate(workflows, result, part)
  }
  throw Error('illegal workflow')
}

export function findAcceptablePartRanges(workflows: Readonly<Record<string, Workflow>>) {
  const accepted: PartRange[] = []

  const evaluate = (part: PartRange, workflowOrResult: Workflow['name'] | Result) => {
    if (workflowOrResult === 'R') return
    if (workflowOrResult === 'A') {
      accepted.push(part)
      return
    }
    const workflow = workflows[workflowOrResult]
    for (const { condition, result } of workflow.rules) {
      if (condition) {
        const { category, operator, value } = condition
        const [min, max] = part[category]
        if (operator === '<') {
          // no split, apply workflow, and break
          if (max < value) {
            evaluate(part, result)
            break
          }
          // split, apply workflow and modify existing part to continue with next rule
          if (min < value) {
            evaluate({ ...part, [category]: [min, value - 1] }, result)
            part[category] = [value, max]
          }
        } else if (operator === '>') {
          if (min > value) {
            evaluate(part, result)
            break
          }
          if (max > value + 1) {
            evaluate({ ...part, [category]: [value + 1, max] }, result)
            part[category] = [min, value]
          }
        }
      } else evaluate(part, result)
    }
  }
  evaluate({ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, 'in')
  return accepted
}

export function calculateCombinations(parts: PartRange[]) {
  return sum(
    parts.map((part) =>
      Object.values(part)
        .map(([min, max]) => max - min + 1)
        .reduce((a, c) => a * c),
    ),
  )
}
