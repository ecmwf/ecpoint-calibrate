import { connect } from 'react-redux'

import App from './component'
import { setScratchValue } from './actions'

const mapStateToProps = state => ({
  page: state.page,
  app: state.app,
})

const mapDispatchToProps = dispatch => ({
  setScratchValue: value => {
    dispatch(setScratchValue(value))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
