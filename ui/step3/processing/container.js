import { connect } from 'react-redux'

import Processing from './component'

import { updatePageCompletion } from './actions'

const mapStateToProps = state => ({
  predictand: state.predictand,
  observations: state.observations,
  predictors: state.predictors,
  parameters: state.parameters,
  computations: state.computations,
})

const mapDispatchToProps = dispatch => ({
  updatePageCompletion: () => dispatch(updatePageCompletion()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Processing)
