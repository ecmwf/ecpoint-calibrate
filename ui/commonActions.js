export const completeSection = (workflow, page, section) => ({
  type: 'PAGE.COMPLETE_SECTION',
  workflow,
  page,
  section,
})

export const setWorkflow = workflow => ({
  type: 'WORKFLOW.SET_WORKFLOW',
  data: workflow,
})
