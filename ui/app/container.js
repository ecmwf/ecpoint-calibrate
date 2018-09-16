import { connect } from 'react-redux'

import App from './component'

import { setPage } from './menu/actions'

const mapStateToProps = state => ({
  page: state.page,
})

const mapDispatchToProps = dispatch => ({
  onPageChange: page => {
    dispatch(setPage(page))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
