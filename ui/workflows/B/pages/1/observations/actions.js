export const setPath = path => ({
  type: 'OBSERVATIONS.SET_PATH',
  data: path && path.length !== 0 ? path.pop() : null,
})
