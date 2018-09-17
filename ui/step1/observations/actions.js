export const setPath = path => ({
  type: 'OBSERVATIONS.SET_PATH',
  data: path && path.length !== 0 ? path.pop() : null,
})

export const updatePageCompletion = (page, isComplete) => ({
  type: 'PAGE.UPDATE_PAGE_COMPLETION',
  page,
  section: 'observations',
  isComplete,
})
