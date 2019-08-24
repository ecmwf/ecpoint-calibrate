import { connect } from 'react-redux'

import Breakpoints from './component'

import { setWeatherTypeMatrix } from './actions'

const mapStateToProps = state => ({
  breakpoints: state.postprocessing.thrGridOut,
})

const mapDispatchToProps = dispatch => ({
  onWeatherTypeMatrixChange: (labels, matrix) =>
    dispatch(setWeatherTypeMatrix(labels, matrix)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breakpoints)
