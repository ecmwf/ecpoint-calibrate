import { connect } from 'react-redux'

import PredictantsComponent from './component'

import {
  setPredictantType,
  setPredictantPath,
  setPredictorsPath
} from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
  parameters: state.parameters,
  computations: state.computations,
  page: state.page.page
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),

  onPredictantPathChange: path => dispatch(setPredictantPath(path)),

  onPredictorsPathChange: path => dispatch(setPredictorsPath(path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictantsComponent)
