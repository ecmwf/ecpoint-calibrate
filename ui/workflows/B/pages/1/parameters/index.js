export { default } from './container'

export const isEmpty = state =>
  !state.date_start ||
  !state.date_end ||
  state.limSU === '' ||
  state.modelType === '' ||
  state.discretization === '' ||
  state.startTime === ''
