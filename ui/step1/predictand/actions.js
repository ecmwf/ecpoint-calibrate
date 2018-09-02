export const setPath = path => ({
  type: 'PREDICTAND.SET_PATH',
  data: path.length !== 0 ? path.pop() : null,
})

export const updatePageCompletion = (page, isComplete) => ({
  type: 'PAGE.UPDATE_PAGE_COMPLETION',
  page,
  section: 'predictand',
  isComplete,
})
