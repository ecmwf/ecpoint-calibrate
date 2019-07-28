import React, { Fragment } from 'react'

import Predictand from './predictand'
import Observations from './observations'
import Predictors from './predictors'
import Parameters from './parameters'
import Output from './output'

const Page1 = props => (
  <Fragment>
    <Observations />
    <Parameters />
    <Predictand />
    <Predictors />
    <Output />
  </Fragment>
)

export default Page1
