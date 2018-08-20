export { default } from './container'

export const isEmpty = state =>
  state.date_start === '' ||
  state.date_end === '' ||
  state.acc === '' ||
  state.limSU === '' ||
  state.range === '' ||
  state.outPath === ''
