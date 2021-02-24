import React, { Component } from 'react'

import { Grid, Button } from 'semantic-ui-react'
import Iframe from 'react-iframe'

import client from '~/utils/client'
import toast from '~/utils/toast'

class Processing extends Component {
  state = { status: 'initial' }

  runComputation() {
    this.props.setProcessing(true)

    const parameters = {
      date_start: this.props.parameters.date_start,
      date_end: this.props.parameters.date_end,
      spinup_limit: this.props.parameters.limSU,
      out_path: this.props.parameters.outPath,
      out_format: this.props.parameters.outFormat,
      model_type: this.props.parameters.modelType,
      model_interval: this.props.parameters.model_interval,
      step_interval: this.props.parameters.step_interval,
      start_time: this.props.parameters.startTime,
    }

    const predictand = {
      path: this.props.predictand.path,
      accumulation: this.props.predictand.accumulation || 0,
      code: this.props.predictand.code,
      error: this.props.predictand.error,
      min_value: this.props.predictand.minValueAcc || -1, // Ignored by the backend for FE
      type_: this.props.predictand.type,
      units: this.props.predictand.units,
    }

    const predictors = {
      ...this.props.predictors,
      sampling_interval: this.props.predictors.sampling_interval || -1, // Ignored by the backend for FE
    }

    client
      .post('/computation-logs', {
        parameters,
        predictand,
        predictors,
        observations: this.props.observations,
        computations: this.props.computations.fields,
      })
      .then(() => {
        this.props.completeSection()
      })
      .catch(e => {
        if (e.response !== undefined) {
          const error = `(${
            e.response.status
          }) ${e.response.config.method.toUpperCase()} ${e.response.config.url}: ${
            e.response.data
          }`

          console.error(error)
          toast.error(error)
        } else {
          toast.error('Empty response from server')
        }
      })
      .then(() => this.props.setProcessing(false))
  }

  render = () => (
    <Grid centered container>
      <Grid.Row>
        <Button
          content="Launch computation"
          onClick={() => this.runComputation()}
          disabled={this.props.running === true}
          icon="cog"
          labelPosition="left"
        />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Iframe
            url="http://localhost:9001"
            width="100%"
            height="750px"
            display="initial"
            position="relative"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Processing
