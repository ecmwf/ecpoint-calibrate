const defaultState = {
  fields: [],
  errors: {
    isFERChecked: false,
    isFEChecked: false,
    minValueFER: '1'
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'COMPUTATIONS.ADD': {
      return {
        ...state,
        fields: [
          ...state.fields,
          {
            index: state.fields.length,
            name: action.name,
            field: action.field,
            inputs: action.inputs,
            scale: { op: 'MULTIPLY', value: 1 }
          }
        ]
      }
    }

    case 'COMPUTATIONS.REMOVE': {
      return {...state, fields: state.fields.filter(item => item.index !== action.index)}
    }

    case 'COMPUTATIONS.UPDATE_NAME':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, name: action.name }
          }
          return item
        })
      }

    case 'COMPUTATIONS.UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, field: action.field }
          }
          return item
        })
      }

    case 'COMPUTATIONS.UPDATE_INPUTS':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, inputs: action.inputs }
          }
          return item
        })
      }

    case 'COMPUTATIONS.SET_SCALE_OP':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, scale: { ...item.scale, op: action.op } }
          }
          return item
        })
      }

    case 'COMPUTATIONS.SET_SCALE_VALUE':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, scale: { ...item.scale, value: action.value } }
          }
          return item
        })
      }

    case 'COMPUTATIONS.TOGGLE_FORECAST_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          isFEChecked: !state.errors.isFEChecked
        }
      }

    case 'COMPUTATIONS.TOGGLE_FORECAST_ERROR_RATIO':
      return {
        ...state,
        errors: {
          ...state.errors,
          isFERChecked: !state.errors.isFERChecked
        }
      }

    case 'COMPUTATIONS.CHANGE_MIN_VALUE_FER':
      return {
        ...state,
        errors: {
          ...state.errors,
          minValueFER: action.data
        }
      }

    default: {
      return state
    }
  }
}
