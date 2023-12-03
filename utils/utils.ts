export const sum = (numbers: number[]) => numbers.reduce((a, c) => a + c)
export const parseLines = (input: string) => input.split('\n').filter(Boolean)
