import { connect } from 'react-redux'

import Database from './component'

import {
  setPredictandType,
  setPredictandPath,
  setPredictorsPath,
  updatePageCompletion,
} from './actions'

const mapStateToProps = state => ({
  database: state.database,
})

const mapDispatchToProps = dispatch => ({
  onPredictandTypeChange: type => dispatch(setPredictandType(type)),

  onPredictandPathChange: path => dispatch(setPredictandPath(path)),

  onPredictorsPathChange: path => dispatch(setPredictorsPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Database)
