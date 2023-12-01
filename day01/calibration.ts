const digits: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}

export const replaceSpelledOutDigits = (text: string): string =>
  Object.entries(digits).reduce((a, [search, replace]) => a.replaceAll(search, replace), text)

export const getSumOfCalibrationValues = (text: string) =>
  text
    .split('\n')
    .map(calibrationValueFromLine)
    .reduce((a, c) => a + c)

export const calibrationValueFromLine = (line: string): number =>
  Number(getFirstDigit(line) + getLastDigit(line))

export const getFirstDigit = (line: string) => {
  // use lazy regex to find first digit
  const match = /^.*?(\d|one|two|three|four|five|six|seven|eight|nine)/.exec(line)
  if (!match || !match[1]) throw Error('line does not contain digits')
  const digit = match[1]
  return digits[digit] ?? digit
}

export const getLastDigit = (line: string) => {
  // use reversed lookup and regex
  const reversed = [...line].reverse().join('')
  const match = /^.*?(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/.exec(reversed)
  if (!match || !match[1]) throw Error('line does not contain digits')
  const digit = [...match[1]].reverse().join('')
  return digits[digit] ?? digit
}
