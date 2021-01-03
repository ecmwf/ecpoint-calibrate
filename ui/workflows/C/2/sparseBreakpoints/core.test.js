import { validateThresholdSequence } from './core'

const thresholdSequenceTestCases = [
  /**
   * OK cases.
   */

  [['-inf', 'inf'], true],
  [['-inf', 'inf', '', ''], true],
  [['-inf', '1', '1', 'inf'], true],
  [['-inf', '1', '1', '2', '2', 'inf'], true],
  [['-inf', '-1', '-1', '2.1', '2.1', 'inf'], true],

  /**
   * KO cases.
   */

  [['a', 'b'], false], // invalid  tokens
  [['inf', '1', '1', 'inf'], false], // sequence starts with inf
  [['-inf', '1', '1', '-inf'], false], // sequence ends with -inf
  [['-inf', '', '1', 'inf'], false], // gaps in sequence
  [['-inf', '', '', 'inf'], false], // gaps in sequence
  [['1', '2', '2', 'inf'], false], // sequence does not start with -inf
  [['-inf', '1', '1', '2'], false], // sequence does not end with inf
  [['-inf', '1', '2', '3', '3', 'inf'], false], // non-continuous sequence
  [['-inf', '2', '2', '1', '1', 'inf'], false], // non-increasing sequence
  [['-inf', '2', '2', '2', '2', 'inf'], false], // non-increasing sequence
]

test.each(thresholdSequenceTestCases)(
  'sequence %s should validate to %s',
  (sequence, expected) => {
    expect(validateThresholdSequence(sequence)).toBe(expected)
  }
)
