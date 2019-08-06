import { connect } from 'react-redux'

import Predictors from './component'

import { setPath, setSamplingInterval } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  predictors: state.predictors,
  predictand: state.predictand,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  completeSection: (workflow, page) => dispatch(completeSection('B', 1, 'predictors')),

  onSamplingIntervalChange: value => dispatch(setSamplingInterval(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictors)
