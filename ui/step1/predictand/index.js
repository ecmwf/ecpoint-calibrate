export { default } from './container'

export const isEmpty = predictand =>
  predictand.path === null || predictand.type === null
