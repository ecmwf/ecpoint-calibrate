import { connect } from 'react-redux'

import PostProcessing from './component'

import { setBreakpoints } from '../breakpoints/actions'

const getFirstRow = fields =>
  [{ readOnly: true, value: 1 }].concat(
    _.flatMap(fields, _ => [{ value: '' }, { value: '' }])
  )

const generateInitialGrid = fields => {
  const header = [{ readOnly: true, value: '' }].concat(
    _.flatMap(fields, field => [
      { readOnly: true, value: field + '_thrL' },
      { readOnly: true, value: field + '_thrH' },
    ])
  )

  const firstRow = [getFirstRow(fields)]
  return [header].concat(firstRow)
}

const mapStateToProps = state => ({
  thrGridIn:
    state.postprocessing.thrGridIn.length > 0
      ? state.postprocessing.thrGridIn
      : generateInitialGrid(state.preloader.fields),

  thrGridOut: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  fields: state.preloader.fields,
  yLim: state.postprocessing.yLim,
})

const mapDispatchToProps = dispatch => ({
  onYLimChange: value => dispatch({ type: 'POSTPROCESSING.SET_Y_LIM', value }),

  setBreakpoints: (labels, matrix) => dispatch(setBreakpoints(labels, matrix)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostProcessing)
