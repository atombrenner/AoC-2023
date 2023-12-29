import { describe, it, test, expect } from 'bun:test'
import { evaluate, parseInput } from './solution'
import { readFileSync } from 'fs'

const { workflows, parts } = parseInput(readFileSync('day19/example.txt', 'utf-8'))

describe('parseInput', () => {
  it('should parse workflow qqz', () => {
    const { name, rules } = workflows.qqz
    expect(name).toEqual('qqz')
    expect(rules).toStrictEqual([
      { condition: { category: 's', operator: '>', value: 2770 }, result: 'qs' },
      { condition: { category: 'm', operator: '<', value: 1801 }, result: 'hdj' },
      { result: 'R' },
    ])
  })
})

describe('evaluatePart', () => {
  it('it should accept the first part', () => {
    expect(evaluate(workflows, 'in', parts[0])).toBe('A')
  })

  it('it should reject the second part', () => {
    expect(evaluate(workflows, 'in', parts[1])).toBe('R')
  })
})
