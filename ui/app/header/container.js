import { connect } from 'react-redux'

import Header from './component'

const mapStateToProps = state => ({
  workflow: state.workflow,
})

const mapDispatchToProps = dispatch => ({
  resetApp: () => dispatch({ type: 'RESET_APP' }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
