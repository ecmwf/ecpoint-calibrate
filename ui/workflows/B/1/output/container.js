import { connect } from 'react-redux'

import Output from './component'

import { setOutPath, setOutFormat } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onOutPathChange: path => dispatch(setOutPath(path)),

  onOutFormatChange: format => dispatch(setOutFormat(format)),

  completeSection: () => dispatch(completeSection('B', 1, 'output')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Output)
