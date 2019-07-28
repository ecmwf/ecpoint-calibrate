import { connect } from 'react-redux'

import Output from './component'

import { setOutPath } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onOutPathChange: path => dispatch(setOutPath(path)),

  completeSection: () => dispatch(completeSection('B', 1, 'output')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Output)
