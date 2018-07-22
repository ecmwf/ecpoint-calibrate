import { connect } from 'react-redux'

import PredictantsComponent from './component'

import {
  setPredictantType,
  setPredictantPath,
  setPredictorsPath,
  appendLog
} from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
  parameters: state.parameters,
  computations: state.computations,
  page: state.page.page,
  logs: state.logs
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),

  onPredictantPathChange: path => dispatch(setPredictantPath(path)),

  onPredictorsPathChange: path => dispatch(setPredictorsPath(path)),

  appendLog: log => dispatch(appendLog(log))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictantsComponent)
