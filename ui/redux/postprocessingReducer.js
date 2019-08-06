const defaultState = {
  thrGridIn: [],
  thrGridOut: [],
  fields: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'POSTPROCESSING.SET_THRESHOLD_SPLITS': {
      return { ...state, thrGridIn: action.grid }
    }

    case 'POSTPROCESSING.SET_WT_MATRIX': {
      return { ...state, thrGridOut: action.grid }
    }

    case 'POSTPROCESSING.SET_FIELDS': {
      return { ...state, fields: action.data }
    }

    default: {
      return state
    }
  }
}
