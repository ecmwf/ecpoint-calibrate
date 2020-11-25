export const onSaveOperationClosed = () => ({
  type: 'POSTPROCESSING.SET_SAVE_OPERATION_MODE',
  data: null,
})

export const setLoading = value => ({
  type: 'POSTPROCESSING.SET_LOADING',
  data: value,
})
