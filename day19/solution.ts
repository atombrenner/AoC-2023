export type Part = {
  x: number
  m: number
  a: number
  s: number
}

export type Category = keyof Part

export type Result = 'A' | 'R'

export type Workflow = {
  name: string
  rules: Rule[]
}

export type Rule = {
  condition?: Condition
  result: Result | Workflow['name']
}

//export type Condition = (part: Part) => boolean

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
