import React, { Component } from 'react'

import { Grid, Segment, Button, Modal } from 'semantic-ui-react'

import client from '~/utils/client'
import download from '~/utils/download'
import * as jetpack from 'fs-jetpack'

class Processing extends Component {
  state = { status: 'initial', logs: [], asciiModelOpen: false }

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
      discretization: this.props.observations.discretization,
      start_time: this.props.observations.startTime,
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
        this.props.completeSection()
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

  getAsciiTableModal = () => (
    <Modal
      size={'large'}
      open={this.state.asciiModelOpen}
      onClose={() => this.setState({ asciiModelOpen: false })}
    >
      <Modal.Header>ASCII Table</Modal.Header>
      <Modal.Content>
        <pre>{jetpack.read(this.props.parameters.outPath)}</pre>
      </Modal.Content>
    </Modal>
  )

  render() {
    return (
      <Grid columns={2} centered>
        <Grid.Row>
          <Button
            content="Launch computation"
            onClick={() => this.runComputation()}
            disabled={this.state.status == 'running' ? true : null}
            icon="cog"
            labelPosition="left"
          />
          {this.state.status == 'completed' && (
            <Button
              content="View ASCII table"
              icon="eye"
              labelPosition="left"
              onClick={() => {
                this.setState({ asciiModelOpen: true })
              }}
            />
          )}
          <Button
            content="Go back to main menu"
            icon="eye"
            labelPosition="left"
            onClick={() => this.props.resetApp()}
          />
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
          {this.getAsciiTableModal()}
        </Grid.Row>
      </Grid>
    )
  }
}

export default Processing
