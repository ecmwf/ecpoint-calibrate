const defaultState = {
  thrGridIn: [],
  thrGridOut: [],
  fields: [],
  yLim: 1,
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

    case 'POSTPROCESSING.SET_Y_LIM': {
      return { ...state, yLim: action.value }
    }

    default: {
      return state
    }
  }
}
