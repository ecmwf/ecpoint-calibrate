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
            addScale: isFirstComputation ? action.data.addScale : '0',
            mulScale: isFirstComputation ? action.data.mulScale : '1',
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
              units:
                action.field === 'RATIO_FIELD'
                  ? 'NoUnit'
                  : action.field === 'LOCAL_SOLAR_TIME'
                  ? 'Hours (0 to 24)'
                  : action.field === '24H_SOLAR_RADIATION'
                  ? 'W m**-2'
                  : item.units,
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
              name: action.name,
              units: !['RATIO_FIELD', '24H_SOLAR_RADIATION'].includes(item.field)
                ? action.inputs.length > 0
                  ? action.inputs[0].units
                  : item.units
                : item.units,
            }
          }
          return item
        }),
      }

    case 'COMPUTATIONS.SET_INPUT_METADATA':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              inputs: item.inputs.map(input => ({
                ...input,
                units: input.code === action.code ? action.units : input.units,
                name: input.code === action.code ? action.name : input.name,
              })),
              units: !['RATIO_FIELD', '24H_SOLAR_RADIATION'].includes(item.field)
                ? item.mulScale === '1' && item.addScale === '0'
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

    case 'COMPUTATIONS.SET_MUL_SCALE_VALUE':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              mulScale: action.value,
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

    case 'COMPUTATIONS.SET_ADD_SCALE_VALUE':
      return {
        ...state,
        fields: state.fields.map(item => {
          if (item.index === action.index) {
            return {
              ...item,
              addScale: action.value,
              units:
                item.field !== 'RATIO_FIELD'
                  ? action.value === '0'
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
