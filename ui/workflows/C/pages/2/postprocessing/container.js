import { connect } from 'react-redux'

import PostProcessing from './component'

import { setThresholdSplits, setFields, onFieldsSortEnd } from './actions'

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

const mapStateToProps = state => {
  const defaultFields = state.app.scratch
    ? state.computations.fields
        .filter(field => field.isPostProcessed)
        .map(field => field.shortname)
    : state.preloader.fields

  const fields =
    state.postprocessing.fields.length > 0 ? state.postprocessing.fields : defaultFields

  return {
    thrGridIn:
      state.postprocessing.thrGridIn.length > 0
        ? state.postprocessing.thrGridIn
        : generateInitialGrid(fields),
    path: state.parameters.outPath || state.preloader.path,
    fields: fields,
  }
}

const mapDispatchToProps = dispatch => ({
  onThresholdSplitsChange: grid => dispatch(setThresholdSplits(grid)),

  setFields: fields => dispatch(setFields(fields)),

  onFieldsSortEnd: (fields, oldIndex, newIndex) =>
    dispatch(onFieldsSortEnd(fields, oldIndex, newIndex)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostProcessing)
