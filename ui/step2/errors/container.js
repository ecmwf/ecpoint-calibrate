import { connect } from 'react-redux'

import Errors from './component'

const mapStateToProps = state => ({
  errors: state.computations.errors
})

const mapDispatchToProps = dispatch => ({
  toggleFE: () =>
    dispatch({type: 'COMPUTATIONS.TOGGLE_FORECAST_ERROR'}),

  toggleFER: () =>
    dispatch({type: 'COMPUTATIONS.TOGGLE_FORECAST_ERROR_RATIO'}),

  changeMinValueFER: (data) =>
    dispatch({type: 'COMPUTATIONS.CHANGE_MIN_VALUE_FER', data})
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Errors)
