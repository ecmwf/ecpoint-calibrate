import React, { Component, Fragment } from 'react'

import SelectPredictant from './SelectPredictant'
import PredictantErrors from './PredictantErrors'
import Computations from './Computations'
import Parameters from './Parameters'

import client from '../utils/rpc'

class Predictant extends Component {
  runComputation() {
    if (this.props.page === 2) {
      const parameters = {
        date_start: this.props.parameters.date_start,
        date_end: this.props.parameters.date_end,
        accumulation: this.props.parameters.acc,
        limit_spin_up: this.props.parameters.limSU,
        leadstart_range: this.props.parameters.range,
        observation_path: this.props.predictant.predictantPath,
        forecast_path: this.props.predictant.predictorsPath,
        out_path: this.props.parameters.outPath,
      }

      client.invoke('run_computation', parameters, (error, res) => {
        if (error) {
          console.error(error)
        } else {
          console.log(res)
        }
      })
    }
  }

  render() {
    if (this.props.page === 0) {
      return (
        <Fragment>
          <SelectPredictant {...this.props} />
          <Parameters {...this.props} />
        </Fragment>
      )
    }

    if (this.props.page === 1) {
      return <Computations {...this.props} />
    }

    if (this.props.page === 2) {
      this.runComputation()
      return null
    }
  }
}

export default Predictant
