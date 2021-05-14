const defaultState = {
  thrGridIn: [],
  thrGridOut: [],
  fields: [],
  yLim: 100,
  tree: null,
  saveOperationMode: null,
  fieldRanges: null,
  excludedPredictors: [],
}

const getFirstRow = (fields, ranges) =>
  [{ readOnly: true, value: 1 }].concat(
    _.flatMap(fields, field => [
      { value: ranges[field][0] },
      { value: ranges[field][1] },
    ])
  )

const generateInitialGrid = (fields, ranges) => {
  const header = [{ readOnly: true, value: '' }].concat(
    _.flatMap(fields, field => [
      { readOnly: true, value: field + '_thrL' },
      { readOnly: true, value: field + '_thrH' },
    ])
  )

  const firstRow = [getFirstRow(fields, ranges)]
  return [header].concat(firstRow)
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'POSTPROCESSING.SET_THRESHOLD_SPLITS': {
      return {
        ...state,
        thrGridIn:
          action.grid.length > 0
            ? action.grid
            : generateInitialGrid(state.fields, state.fieldRanges),
      }
    }

    case 'POSTPROCESSING.SET_WT_MATRIX': {
      return { ...state, thrGridOut: action.grid }
    }

    case 'POSTPROCESSING.SET_TREE': {
      return { ...state, tree: action.data }
    }

    case 'POSTPROCESSING.SET_FIELDS': {
      return {
        ...state,
        fields: action.data,
        thrGridIn: generateInitialGrid(action.data, state.fieldRanges),
      }
    }

    case 'POSTPROCESSING.ADD_EXCLUDED_PREDICTOR': {
      return {
        ...state,
        excludedPredictors: [...state.excludedPredictors, action.data],
      }
    }

    case 'POSTPROCESSING.SET_Y_LIM': {
      return { ...state, yLim: action.value }
    }

    case 'POSTPROCESSING.SET_LOADING': {
      return { ...state, loading: action.data }
    }

    case 'POSTPROCESSING.SET_SAVE_OPERATION_MODE': {
      return { ...state, saveOperationMode: action.data }
    }

    case 'POSTPROCESSING.SET_FIELD_RANGE': {
      const fieldRanges = {
        ...state.fieldRanges,
        [action.data.field]: [
          action.data.range[0] !== undefined
            ? action.data.range[0]
            : state.fieldRanges[action.data.field][0],
          action.data.range[1] !== undefined
            ? action.data.range[1]
            : state.fieldRanges[action.data.field][1],
        ],
      }

      return {
        ...state,
        thrGridIn: generateInitialGrid(state.fields, fieldRanges),
        fieldRanges,
      }
    }

    default: {
      return state
    }
  }
}
