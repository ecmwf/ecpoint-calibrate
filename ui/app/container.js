import { connect } from 'react-redux'

import App from './component'
import { setScratchValue, setWorkflow } from './actions'

const mapStateToProps = state => ({
  page: state.page,
  app: state.app,
  workflow: state.workflow,
})

const mapDispatchToProps = dispatch => ({
  setScratchValue: value => {
    dispatch(setScratchValue(value))
  },
  setWorkflow: workflow => dispatch(setWorkflow(workflow)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
