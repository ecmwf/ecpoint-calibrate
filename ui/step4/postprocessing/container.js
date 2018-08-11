import { connect } from 'react-redux'

import PostProcessing from './component'

import { setThresholdSplits } from './actions'

const mapStateToProps = state => ({
  postprocessing: state.postprocessing
})

const mapDispatchToProps = dispatch => ({
  onThresholdSplitsChange: grid =>
    dispatch(setThresholdSplits(grid))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostProcessing)
