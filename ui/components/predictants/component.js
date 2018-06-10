import React from 'react'

import SelectPredictant from './SelectPredictant'
import PredictantErrors from './PredictantErrors'
import Parameters from './Parameters'

const Predictant = props => (
  <div>
    <SelectPredictant {...props} />
    <PredictantErrors />
    <Parameters />
  </div>
)

export default Predictant
