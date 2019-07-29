import { connect } from 'react-redux'

import App from './component'
import { setWorkflow } from './actions'

const mapStateToProps = state => ({
  page: state.page,
  app: state.app,
  workflow: state.workflow,
})

const mapDispatchToProps = dispatch => ({
  setWorkflow: workflow => dispatch(setWorkflow(workflow)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
