import _ from 'lodash'

import { realNumbers } from '~/utils/patterns'

export const validateThresholdSequence = sequence => {
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
  const stack = []
  trimmedSequence.forEach(el => stack.push(el))

  /**
   * STEP 4: The first and last elements of the sequence should always be "-inf"
   * and "inf" respectively; the sequence is otherwise invalid.
   */
  if (stack[0] !== '-inf' || stack.slice(-1)[0] !== 'inf') {
    return false
  }

  /**
   * STEP 5: Define a helper to check if a given string is a valid element of
   * the sequence.
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
   * STEP 6: Define a helper to check if a < b.
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

  /**
   * STEP 7: Stack based VM to evaluate the validity of the sequence.s
   *
   * We loop over the stack until no elements are remaining.
   */

  let previousLow = 'inf'
  while (stack.length !== 0) {
    /**
     * STEP7.1: Get the (low, high) pair from the end of the sequence.
     *
     * NOTE: This mutates the stack.
     */
    const [high, low] = [stack.pop(), stack.pop()]

    /**
     * STEP 7.2: If low or high are unrecognized tokens, the entire sequence
     * is invalid.
     */
    if (!isAllowedToken(high) || !isAllowedToken(low)) {
      return false
    }

    /**
     * STEP 7.3: low can never be "inf" and high can never be "-inf".
     */
    if (low === 'inf' || high === '-inf') {
      return false
    }

    /**
     * STEP 7.4: low  should be  strictly less than high.
     */
    if (!isLessThan(low, high)) {
      return false
    }

    /**
     * STEP 7.5: the current high should be same as the previous high
     * (in reverse stack order).
     */
    if (high !== previousLow) {
      return false
    }

    /**
     * STEP 7.6: save the low value for use in the next iteration.
     */
    previousLow = low
  }

  /**
   * STEP 8: all KO cases exhausted. The sequence is valid.
   */
  return true
}
