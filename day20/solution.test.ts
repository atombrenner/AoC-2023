import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'fs'
import { parseInput, pushButton } from './solution'

describe('parseInput', () => {
  it('should parse example1.txt', () => {
    const input = readFileSync('day20/example1.txt', 'utf-8')
    const modules = parseInput(input)

    expect(modules['broadcaster'].toString()).toEqual('broadcaster: (button) -> (a, b, c)')
    expect(modules['a'].toString()).toEqual('a: (broadcaster, inv) -> (b)')
    expect(modules['b'].toString()).toEqual('b: (a, broadcaster) -> (c)')
    expect(modules['c'].toString()).toEqual('c: (b, broadcaster) -> (inv)')
    expect(modules['inv'].toString()).toEqual('inv: (c) -> (a)')
  })

  it('should parse example2.txt', () => {
    const input = readFileSync('day20/example2.txt', 'utf-8')
    const modules = parseInput(input)

    expect(modules['broadcaster'].toString()).toEqual('broadcaster: (button) -> (a)')
    expect(modules['a'].toString()).toEqual('a: (broadcaster) -> (inv, con)')
    expect(modules['b'].toString()).toEqual('b: (inv) -> (con)')
    expect(modules['inv'].toString()).toEqual('inv: (a) -> (b)')
    expect(modules['con'].toString()).toEqual('con: (a, b) -> (output)')
  })

  it('should parse input.txt', () => {
    const input = readFileSync('day20/example2.txt', 'utf-8')
    const modules = parseInput(input)
    expect(Object.keys(modules).length).toEqual(input.split('\n').length + 2)
    expect(modules.button.toString()).toEqual('button: () -> (broadcaster)')
  })
})

describe('pushButton', () => {
  it('should count 8 low and 4 high pulses for example 1', () => {
    const input = readFileSync('day20/example1.txt', 'utf-8')
    const modules = parseInput(input)
    const count = pushButton(modules)
    expect(count).toEqual([8, 4])
  })

  it('should count 4 low and 4 high pulses for example 2', () => {
    const input = readFileSync('day20/example2.txt', 'utf-8')
    const modules = parseInput(input)
    expect(pushButton(modules)).toEqual([4, 4])
    expect(pushButton(modules)).toEqual([4, 2])
    expect(pushButton(modules)).toEqual([5, 3])
    expect(pushButton(modules)).toEqual([4, 2])
  })
})
