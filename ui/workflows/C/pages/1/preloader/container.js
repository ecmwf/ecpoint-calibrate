import { connect } from 'react-redux'

import Preloader from './component'

import { setPath } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  path: state.preloader.path,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  completeSection: (workflow, page) => dispatch(completeSection('C', 1, 'preloader')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preloader)
