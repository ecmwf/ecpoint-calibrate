import { connect } from 'react-redux'

import Preloader from './component'

import { setPath } from './actions'

const mapStateToProps = state => ({
  path: state.preloader.path,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preloader)
