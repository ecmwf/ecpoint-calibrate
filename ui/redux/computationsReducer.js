const defaultState = {
  fields: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'COMPUTATIONS.ADD': {
      const isFirstComputation = state.fields.length === 0
      return {
        ...state,
        fields: [
          ...state.fields,
          {
            index: state.fields.length,
            shortname: isFirstComputation ? action.data.shortname : '',
            fullname: isFirstComputation ? action.data.fullname : '',
            field: isFirstComputation ? action.data.field : '',
            inputs: isFirstComputation ? action.data.inputs : [],
            scale: isFirstComputation
              ? action.data.scale
              : { op: 'MULTIPLY', value: '1' },
            isPostProcessed: true,
            units: '',
          },
        ],
      }
    }

    case 'COMPUTATIONS.REMOVE': {
      return {
        ...state,
        fields: state.fields.filter(item => item.index !== action.index),
      }
    }

    case 'COMPUTATIONS.UPDATE_SHORT_NAME':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, shortname: action.shortname }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.UPDATE_FULL_NAME':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, fullname: action.fullname }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              field: action.field,
              units: action.field === 'RATIO_FIELD' ? '-' : item.units,
            }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.UPDATE_INPUTS':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              inputs: action.inputs,
              units:
                item.field !== 'RATIO_FIELD'
                  ? action.inputs.length > 0
                    ? action.inputs[0].units
                    : item.units
                  : item.units,
            }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.SET_INPUT_UNITS':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              inputs: item.inputs.map(input => ({
                ...input,
                units: input.code === action.code ? action.units : input.units,
              })),
              units:
                item.field !== 'RATIO_FIELD'
                  ? item.scale.value === '1'
                    ? item.inputs.length > 0
                      ? action.units
                      : '-'
                    : item.units
                  : item.units,
            }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.SET_SCALE_OP':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, scale: { ...item.scale, op: action.op } }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.SET_SCALE_VALUE':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              scale: { ...item.scale, value: action.value },
              units:
                item.field !== 'RATIO_FIELD'
                  ? action.value === '1'
                    ? item.inputs.length > 0
                      ? item.inputs[0].units
                      : '-'
                    : item.units
                  : item.units,
            }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.SET_UNITS':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              units: action.value,
            }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.TOGGLE_POST_PROCESS':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return { ...item, isPostProcessed: !item.isPostProcessed }
          }
          return item
        }),
      }

    default: {
      return state
    }
  }
}
