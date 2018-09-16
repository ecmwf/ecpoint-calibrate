const defaultState = {
  thrGridIn: [],
  fields: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'POSTPROCESSING.SET_THRESHOLD_SPLITS': {
      return { ...state, thrGridIn: action.grid }
    }

    case 'POSTPROCESSING.SET_FIELDS': {
      return { ...state, fields: action.data }
    }

    default: {
      return state
    }
  }
}
