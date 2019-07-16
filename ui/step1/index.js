import React, { Fragment } from 'react'

import Predictand from './predictand'
import Observations from './observations'
import Predictors from './predictors'
import Parameters from './parameters'
import Output from './output'

const Step1 = props => (
  <Fragment>
    <Observations />
    <Parameters />
    <Predictand />
    <Predictors />
    <Output />
  </Fragment>
)

export default Step1
