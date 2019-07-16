import React, { Fragment } from 'react'

import Predictand from './predictand'
import Observations from './observations'
import Predictors from './predictors'
import Parameters from './parameters'

const Step1 = props => (
  <Fragment>
    <Observations />
    <Parameters />
    <Predictand />
    <Predictors />
  </Fragment>
)

export default Step1
