export { default } from './container'

export const isEmpty = state =>
  !state.path ||
  state.discretization === '' ||
  state.startTime === '' ||
  state.units === ''
