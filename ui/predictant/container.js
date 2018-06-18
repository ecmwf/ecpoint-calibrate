import { connect } from 'react-redux'

import PredictantsComponent from './component'

import {
  setPredictantType,
  setPredictantPaths,
  setAccField,
  setLimSUField,
  setRangeField,
} from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),
  onPredictantPathsChange: paths => dispatch(setPredictantPaths(paths)),
  onParametersAccFieldChange: (value, pattern) =>
    dispatch(setAccField(value, pattern)),
  onParametersLimSUFieldChange: (value, pattern) =>
    dispatch(setLimSUField(value, pattern)),
  onParametersRangeFieldChange: (value, pattern) =>
    dispatch(setRangeField(value, pattern)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictantsComponent)
