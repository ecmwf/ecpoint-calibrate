import { connect } from 'react-redux'

import PredictantsComponent from './component'

import { setPredictantType, setPredictantPaths, setAccField } from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),
  onPredictantPathsChange: paths => dispatch(setPredictantPaths(paths)),
  onParametersAccFieldChange: (value, pattern) =>
    dispatch(setAccField(value, pattern)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictantsComponent)
