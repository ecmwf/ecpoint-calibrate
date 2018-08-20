export { default } from './container'

export const isEmpty = state =>
  state.isFERChecked === true || state.isFEChecked === true
