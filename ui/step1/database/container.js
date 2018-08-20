import { connect } from 'react-redux'

import Database from './component'

import {
  setPredictantType,
  setPredictantPath,
  setPredictorsPath,
  updatePageCompletion,
} from './actions'

const mapStateToProps = state => ({
  database: state.database,
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),

  onPredictantPathChange: path => dispatch(setPredictantPath(path)),

  onPredictorsPathChange: path => dispatch(setPredictorsPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Database)
