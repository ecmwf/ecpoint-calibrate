import { connect } from 'react-redux'

import Processing from './component'

import { completeSection, setProcessing } from '~/commonActions'
import { setRunning } from './actions'

const mapStateToProps = state => ({
  predictand: state.predictand,
  observations: state.observations,
  predictors: state.predictors,
  parameters: state.parameters,
  computations: state.computations,
  running: state.processing.running,
})

const mapDispatchToProps = dispatch => ({
  completeSection: (workflow, page) => dispatch(completeSection('B', 3, 'processing')),
  setProcessing: value => dispatch(setProcessing(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Processing)
