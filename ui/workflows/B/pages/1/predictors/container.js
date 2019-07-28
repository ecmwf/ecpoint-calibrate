import { connect } from 'react-redux'

import Predictors from './component'

import { setPath, updatePageCompletion } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  predictors: state.predictors,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  completeSection: (workflow, page) => dispatch(completeSection('B', 1, 'predictors')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictors)
