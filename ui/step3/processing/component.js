import React, { Component } from 'react'

import { Grid, Segment, Button } from 'semantic-ui-react'

import client from '~/utils/client'
import download from '~/utils/download'
import * as jetpack from 'fs-jetpack'

class Processing extends Component {
  state = { status: 'initial', logs: [] }

  appendLog(log) {
    const chunk = log.split('[END]').filter(e => e !== '')
    this.setState(prevState => ({
      logs: [...prevState.logs, ...chunk],
    }))
  }

  runComputation() {
    this.setState({ status: 'running' })
    const parameters = {
      date_start: this.props.parameters.date_start,
      date_end: this.props.parameters.date_end,
      limit_spin_up: this.props.parameters.limSU,
      leadstart_range: this.props.parameters.range,
      out_path: this.props.parameters.outPath,
      model_type: this.props.parameters.modelType,
    }

    const predictand = {
      path: this.props.predictand.path,
      accumulation: this.props.predictand.accumulation,
      code: this.props.predictand.code,
      error: this.props.predictand.error,
      min_value: this.props.predictand.minValueAcc,
    }

    const observations = {
      path: this.props.observations.path,
    }

    const predictors = {
      path: this.props.predictors.path,
      codes: this.props.predictors.codes,
    }

    const computations = {
      fields: this.props.computations.fields,
    }

    client
      .post({
        url: '/computation-logs',
        body: {
          parameters,
          predictand,
          observations,
          predictors,
          computations,
        },
        json: true,
      })
      .on('data', chunk => this.appendLog(chunk.toString()))
      .on('end', () => {
        this.setState({ status: 'completed' })
        console.log('Completing page 3')
        this.props.updatePageCompletion(3, true)
      })
  }

  colorizeLog = log => {
    if (log.startsWith('[WARNING]')) {
      return <span style={{ color: '#d6cc75' }}>{log}</span>
    } else if (log.startsWith('[SUCCESS]')) {
      return <span style={{ color: '#42c88a' }}>{log.replace('[SUCCESS]', '')}</span>
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
            disabled={this.state.status == 'running' ? true : null}
          >
            Launch computation
          </Button>
          {this.state.status == 'completed' && (
            <Button
              content="Save ASCII table"
              icon="download"
              labelPosition="left"
              onClick={() => {
                const asciiData = jetpack.read(this.props.parameters.outPath)
                download('output.ascii', asciiData)
              }}
            />
          )}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {this.state.logs.length > 0 && (
              <Segment inverted>
                {this.state.logs.map((log, idx) => (
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

export default Processing
