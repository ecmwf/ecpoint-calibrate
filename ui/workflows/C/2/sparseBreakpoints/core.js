import _ from 'lodash'

import { realNumbers } from '~/utils/patterns'

/**
 * Helper to check if a given string is a valid element of the sequence.
 *
 * Example:
 *   > isAllowedToken("inf")
 *   true
 *
 *   > isAllowedToken("123.45")
 *   true
 *
 *   > isAllowedToken("ani")
 *   false
 */
const isAllowedToken = token =>
  !['', null, undefined].includes(token) &&
  (token === 'inf' || token === '-inf' || realNumbers.test(token))

/**
 * Define a helper to check if a > b.
 *
 * a = -inf and b = inf are also considered valid.
 */
const isGreaterThan = (a, b) => {
  if (a === 'inf') {
    return true
  }

  if (b === '-inf') {
    return true
  }

  return parseFloat(a) > parseFloat(b)
}

const isGreaterThanOrEqual = (a, b) => a === b || isGreaterThan(a, b)

/**
 * Define a helper to check if a < b.
 *
 * a = -inf and b = inf are also considered valid.
 */
const isLessThan = (a, b) => {
  if (a === '-inf') {
    return true
  }

  if (b === 'inf') {
    return true
  }

  return parseFloat(a) < parseFloat(b)
}

const isLessThanOrEqual = (a, b) => a === b || isLessThan(a, b)

/**
 * Stack based computer to evaluate the validity of the sequence.
 */
class Stack {
  constructor(range) {
    this.range = range
    this.isLinear = _.isEqual(range, ['-inf', 'inf'])
    this.stack = []
    this.lastMaxPoppedElement = '-inf'
  }

  push(value) {
    /**
     * If value is an invalid token, the entire stack sequence is invalid.
     */
    if (!isAllowedToken(value)) {
      throw `Invalid token: ${value}`
    }

    /**
     * The value must be within the limits of the range.
     */
    const [low, high] = this.range
    if (!(isGreaterThanOrEqual(value, low) && isLessThanOrEqual(value, high))) {
      throw `Out of range: ${value}`
    }

    /**
     * Empty stack - nothing to validate.
     */

    if (this.length() === 0) {
      this.stack.push(value)
      return
    }

    /**
     * Stack has even number of elements - going to insert the low threshold.
     */
    if (this.length() % 2 === 0) {
      if (this.top() !== value) {
        throw `Non-contiguous insertion: ${value}`
      }

      /**
       * Discard the top, and save the popped element if it is greater than max.
       */
      this.pop()
      return
    }

    /**
     * Stack has odd number of elements - going to insert the high threshold.
     */
    if (this.length() % 2 === 1) {
      if (this.isLinear && !isGreaterThan(value, this.lastMaxPoppedElement)) {
        throw `Non-increasing insertion: ${value}`
      }

      if (!this.isLinear && this.top() === value) {
        this.pop()
        return
      }

      this.stack.push(value)
      return
    }
  }

  pop() {
    const el = this.stack.pop()

    if (isGreaterThan(el, this.lastMaxPoppedElement)) {
      this.lastMaxPoppedElement = el
    }

    return el
  }

  top() {
    return this.stack.slice(-1)[0]
  }

  bottom() {
    return this.stack.slice(0)[0]
  }

  equals(stack) {
    return _.isEqual(stack, this.stack)
  }

  length() {
    return this.stack.length
  }
}

export const validateThresholdSequence = (sequence, range) => {
  /**
   * STEP 1: Define a helper to remove spaces from the end of the sequence.
   *
   * Example:
   *   > trimRight(["-inf", "1", "", ""])
   *   ["-inf", "1"]
   */
  const trimRight = sequence => {
    while (sequence[sequence.length - 1] === '') {
      sequence.pop()
    }

    return sequence
  }

  /**
   * STEP 2: If trimmed sequence has an odd length, the original sequence
   * is invalid.
   *
   * Example:
   *   ["-inf", "1", ""]
   */
  const trimmedSequence = trimRight(sequence)
  if (trimmedSequence.length % 2 !== 0) {
    return false
  }

  /**
   * STEP 3: Initialize the stack and populate it with the trimmed sequence.
   */
  const stack = new Stack(range)

  try {
    trimmedSequence.forEach(el => stack.push(el))
  } catch {
    return false
  }

  /**
   * STEP 4: Linear sequences MUST evaluate to [-inf, inf]
   */

  if (stack.isLinear && !stack.equals(['-inf', 'inf'])) {
    return false
  }

  /**
   * STEP 5: Circular sequences MAY evaluate to the range.
   */
  if (!stack.isLinear && stack.equals(range)) {
    return true
  }

  /**
   * STEP 6: Circular sequences MAY evaluate to empty stack.
   */
  if (!stack.isLinear && stack.length() === 0) {
    return true
  }

  /**
   * STEP 7: all OK cases for circular sequences exhausted. The sequence
   * is invalid.
   */
  if (!stack.isLinear) {
    return false
  }

  /**
   * STEP 8: all KO cases exhausted. The sequence is valid.
   */
  return true
}
