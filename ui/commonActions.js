export const completeSection = (workflow, page, section) => ({
  type: 'PAGE.COMPLETE_SECTION',
  workflow,
  page,
  section,
})

export const setProcessing = value => ({
  type: 'PROCESSING.SET_RUNNING',
  data: value,
})
