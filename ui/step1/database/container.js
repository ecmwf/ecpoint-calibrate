import { connect } from 'react-redux'

import Database from './component'

import {
  setPredictantType,
  setPredictantPath,
  setPredictorsPath
} from './actions'

const mapStateToProps = state => ({
  database: state.database
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),

  onPredictantPathChange: path => dispatch(setPredictantPath(path)),

  onPredictorsPathChange: path => dispatch(setPredictorsPath(path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Database)
