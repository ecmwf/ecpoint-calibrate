import React, { Component, Fragment } from 'react'

import {
  Grid,
  Segment,
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
  state = { active: false }

  runComputation() {
    this.setState({ active: true })
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
      .post({ url: '/computation-logs', body: parameters, json: true })
      .on('data', chunk => this.props.appendLog(chunk.toString()))
      .on('end', () => this.setState({ active: false }))
  }

  colorizeLog = log => {
    if (log.startsWith('[WARNING]')) {
      return <span style={{ color: '#d6cc75' }}>{log}</span>
    } else if (log.startsWith('[SUCCESS]')) {
      return (
        <span style={{ color: '#42c88a' }}>{log.replace('[SUCCESS]', '')}</span>
      )
    } else if (log.startsWith('[ERROR]')) {
      return <span style={{ color: '#f65353' }}>{log}</span>
    }

    return <span>{log.replace('[INFO]', '')}</span>
  }

  render() {
    return (
      <Grid columns={2} centered>
        <Grid.Row>
          <Button
            onClick={() => this.runComputation()}
            disabled={this.state.active ? true : null}
          >
            Launch computation
          </Button>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {this.props.logs.length > 0 && (
              <Segment inverted>
                {this.props.logs.map((log, idx) => (
                  <p key={idx} className="log">
                    {this.colorizeLog(log)}
                  </p>
                ))}
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default ComputationLogs
