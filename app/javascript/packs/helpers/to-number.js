const NUMBER_GROUP = {
  SINGLE: {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  },
  TEEN: {
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
  },
  DOUBLE: {
    twenty: 20,
    thirty: 30,
    fourty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  },
  HUNDRED: {
    hundred: 100,
  },
  THOUSANDS: {
    thousand: 1000,
    million: 1000000,
    billion: 1000000000,
    trillion: 1000000000000,
  },
}

const getValueAndGroup = (numberString) => {
  const group = Object.keys(NUMBER_GROUP).find(key => (
    NUMBER_GROUP[key][numberString] !== undefined
  ))
  if (group) {
    return [NUMBER_GROUP[group][numberString], group]
  }
  return []
}

/**
 * This class validates number group behind HUNDRED
 * ex1: one hundred => number group is 'SINGLE', it's valid.
 * ex2: ten hundred => number group is 'DOUBLE', it's invalid.
 */
class HundredsValidator {
  constructor() {
    this._groups = []
  }

  add(group) {
    this._groups.push(group)
  }

  isValid() {
    return (this._groups.length === 1 && this._groups[0] === 'SINGLE')
  }
}

/**
 * This class validates number groups between THOUSANDS and HUNDRED
 * ex1: twenty one thousand => number groups is ['SINGLE', 'DOUBLE'],
 *      it's valid.
 * ex2: twenty ten thousand    => number groups is ['TEEN', 'DOUBLE'],
 *      it's invalid.
 */
class ThousandsValidator extends HundredsValidator {
  isValid({ allowEmpty }) {
    if (allowEmpty && this._groups.length === 0) { return true }
    return (
      [
        'SINGLE-DOUBLE', 'SINGLE', 'TEEN', 'DOUBLE',
      ].includes(this._groups.join('-'))
    )
  }
}

/**
 * It returns a number(int) which is recognized by str.
 * If it is not recognized as a number, it returns NaN.
 * 
 * Range of number is (-999999999999999 to 999999999999999) and
 * acceptable delimiter in str is hiphen and space.
 * 
 * ex:
 *  toNumber('one thousand two hundred thirty four')
 *  => 1234
 *  toNumber('one-thousand-two-hundred-thirty-four')
 *  => 1234
 *  toNumber('hoge')
 *  => NaN
 */
const toNumber = (str) => {
  const lower = str.toLowerCase().trim()
  const numberStrings = lower.split(/[ -]+/)
  if (numberStrings[0] === 'zero' && numberStrings.length === 1) {
    return 0
  }
  const isMinus = (numberStrings[0] === 'minus')
  const reversedNumberStrings = (
    isMinus ? numberStrings.slice(1) : numberStrings
  ).reverse()
  let sum = 0
  let multipliedBy = 1
  let validator = new ThousandsValidator()
  const isValid = reversedNumberStrings.every((numberString) => {
    const [value, group] = getValueAndGroup(numberString)
    if (!group) { return false }
    switch (group) {
      case 'THOUSANDS':
        if (
          !validator.isValid({ allowEmpty: multipliedBy === 1 }) ||
          multipliedBy >= value
        ) {
          return false
        }
        validator = new ThousandsValidator()
        multipliedBy = value
        break
      case 'HUNDRED':
        if (
          !validator.isValid({ allowEmpty: true }) ||
          Math.log10(multipliedBy) % 3 !== 0
        ) {
          return false
        }
        validator = new HundredsValidator()
        multipliedBy *= 100
        break
      default:
        validator.add(group)
        sum += (value * multipliedBy)
        break
    }
    return true
  }, 0)
  if (!isValid || !validator.isValid({ allowEmpty: false })) {
    return NaN
  }
  return (isMinus ? -sum : sum)
}

export default toNumber
