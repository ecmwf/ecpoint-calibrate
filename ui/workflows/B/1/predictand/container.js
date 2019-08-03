import { connect } from 'react-redux'

import Predictand from './component'

import {
  setPath,
  incrementPageCompletion,
  setType,
  set_minValueAcc,
  setAccumulation,
} from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  predictand: state.predictand,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  onTypeChange: type => dispatch(setType(type)),

  completeSection: (workflow, page) => dispatch(completeSection('B', 1, 'predictand')),

  change_minValueAcc: value => dispatch(set_minValueAcc(value)),

  onAccumulationChange: value => dispatch(setAccumulation(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictand)
