import { validateThresholdSequence } from './core'

const thresholdSequenceTestCases = [
  /**
   * OK cases.
   */

  [['-inf', 'inf'], ['-inf', 'inf'], true],
  [['-inf', 'inf', '', ''], ['-inf', 'inf'], true],
  [['-inf', '1', '1', 'inf'], ['-inf', 'inf'], true],
  [['-inf', '1', '1', '2', '2', 'inf'], ['-inf', 'inf'], true],
  [['-inf', '-1', '-1', '2.1', '2.1', 'inf'], ['-inf', 'inf'], true],
  [['21', '3', '3', '9', '9', '21'], ['0', '24'], true],

  /**
   * KO cases.
   */

  [['a', 'b'], ['-inf', 'inf'], false], // invalid  tokens
  [['inf', '1', '1', 'inf'], ['-inf', 'inf'], false], // sequence starts with inf
  [['-inf', '1', '1', '-inf'], ['-inf', 'inf'], false], // sequence ends with -inf
  [['-inf', '', '1', 'inf'], ['-inf', 'inf'], false], // gaps in sequence
  [['-inf', '', '', 'inf'], ['-inf', 'inf'], false], // gaps in sequence
  [['1', '2', '2', 'inf'], ['-inf', 'inf'], false], // sequence does not start with -inf
  [['-inf', '1', '1', '2'], ['-inf', 'inf'], false], // sequence does not end with inf
  [['-inf', '1', '2', '3', '3', 'inf'], ['-inf', 'inf'], false], // non-continuous sequence
  [['-inf', '2', '2', '1', '1', 'inf'], ['-inf', 'inf'], false], // non-increasing sequence
  [['-inf', '2', '2', '2', '2', 'inf'], ['-inf', 'inf'], false], // non-increasing sequence
  [['-inf', '2', '2', 'inf', 'inf', '3', '3', 'inf'], ['-inf', 'inf'], false], // non-increasing sequence
  [['21', '3', '3', '9', '9', '20'], ['0', '24'], false], // circular sequence has distinct ends
  [['25', '3', '3', '9', '9', '25'], ['0', '24'], false], // out of range
  [['-1', '3', '3', '9', '9', '-1'], ['0', '24'], false], // out of range
  [['-inf', '2', '2', '3', '3', 'inf'], ['0', '24'], false],
]

test.each(thresholdSequenceTestCases)(
  'sequence %s with range %s should validate to %s',
  (sequence, range, expected) => {
    expect(validateThresholdSequence(sequence, range)).toBe(expected)
  }
)
