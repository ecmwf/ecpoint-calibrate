import { connect } from 'react-redux'

import PredictantsComponent from './component'

import { setPredictantType, setPredictantPaths } from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),
  onPredictantPathsChange: paths => dispatch(setPredictantPaths(paths)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictantsComponent)
