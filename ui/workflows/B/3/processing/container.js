import { connect } from 'react-redux'

import Processing from './component'

import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  predictand: state.predictand,
  observations: state.observations,
  predictors: state.predictors,
  parameters: state.parameters,
  computations: state.computations,
})

const mapDispatchToProps = dispatch => ({
  completeSection: (workflow, page) => dispatch(completeSection('B', 3, 'processing')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Processing)
