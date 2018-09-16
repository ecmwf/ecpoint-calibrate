import { connect } from 'react-redux'

import Menu from './component'

import { setPage } from './actions'

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
)(Menu)
