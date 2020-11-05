import { connect } from 'react-redux'

import Cheaper from './component'

import { setCheaper } from './actions'

const mapStateToProps = state => ({
  cheaper: state.preloader.cheaper,
})

const mapDispatchToProps = dispatch => ({
  onCheaperChange: value => dispatch(setCheaper(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cheaper)
