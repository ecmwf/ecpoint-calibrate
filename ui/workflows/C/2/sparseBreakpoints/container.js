import { connect } from 'react-redux'

import SparseBreakpoints from './component'

import { setBreakpoints } from './actions'

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
  breakpoints:
    state.postprocessing.thrGridIn.length > 0
      ? state.postprocessing.thrGridIn
      : generateInitialGrid(state.preloader.fields),

  fields: state.preloader.fields,
})

const mapDispatchToProps = dispatch => ({
  setBreakpoints: grid => dispatch(setBreakpoints(grid)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SparseBreakpoints)
