import React, { Component, Fragment } from 'react'

import {
  Grid,
  Card,
  Button,
  Checkbox,
  Icon,
  Table,
  Dropdown,
  Input,
  Label,
  Radio,
  Item,
} from 'semantic-ui-react'

import client from '../utils/client'

class ComputationLogs extends Component {
  runComputation() {
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

    client
      .post({url: '/computation-logs', body: parameters, json: true})
      .on('data', chunk => this.props.appendLog(chunk.toString()))
      .on('end', () => console.log('DONE'))
  }

  render() {
    return (
      <Grid>
        <Button onClick={() => this.runComputation()}>Click me.</Button>
        <Grid.Row>
          <Grid.Column>
            {this.props.logs.map((log, idx) => <p key={idx}>{log}</p>)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default ComputationLogs
