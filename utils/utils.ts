import { readFileSync } from 'fs'

export const sum = (numbers: number[]) => numbers.reduce((a, c) => a + c)

export const groupBy = <T>(list: T[], getKey: (item: T) => string): Record<string, T> =>
  list.reduce<Record<string, T>>((a, item) => Object.assign(a, { [getKey(item)]: item }), {})

export const readLines = (path: string) => readFileSync(path, 'utf-8').split('\n')

/**
 * @deprecate danger, will remove empty lines inside the file, use readLines instes
 */
export const parseLines = (input: string) => input.split('\n').filter(Boolean)
