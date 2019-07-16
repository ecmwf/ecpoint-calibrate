import { connect } from 'react-redux'

import Output from './component'

import { setOutPath, updatePageCompletion } from './actions'

const mapStateToProps = state => ({
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onOutPathChange: path => dispatch(setOutPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Output)
