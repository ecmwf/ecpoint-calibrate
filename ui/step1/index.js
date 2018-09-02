import React, { Fragment } from 'react'

import Predictand from './predictand'
import Predictors from './predictors'
import Parameters from './parameters'

const Step1 = props => (
  <Fragment>
    <Predictand />
    <Predictors />
    <Parameters />
  </Fragment>
)

export default Step1
