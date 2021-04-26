import { connect } from 'react-redux'

import Periods from './component'

const mapStateToProps = state => ({
  ranges: state.postprocessing.fieldRanges,
  units: state.binning.units?.predictors,
})

const mapDispatchToProps = dispatch => ({
  setPeriod: (field, range) =>
    dispatch({
      type: 'POSTPROCESSING.SET_FIELD_RANGE',
      data: { field, range },
    }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Periods)
