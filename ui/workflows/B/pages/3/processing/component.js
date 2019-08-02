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
      discretization: this.props.parameters.discretization,
      start_time: this.props.parameters.startTime,
    }

    const predictand = {
      path: this.props.predictand.path,
      accumulation: this.props.predictand.accumulation || 0,
      code: this.props.predictand.code,
      error: this.props.predictand.error,
      min_value: this.props.predictand.minValueAcc,
      type_: this.props.predictand.type,
      units: this.props.predictand.units,
    }

    const observations = {
      path: this.props.observations.path,
      units: this.props.observations.units,
    }

    const predictors = {
      path: this.props.predictors.path,
      codes: this.props.predictors.codes,
    }

    client
      .post({
        url: '/computation-logs',
        body: {
          parameters,
          predictand,
          observations,
          predictors,
          computations: this.props.computations.fields,
        },
        json: true,
      })
      .on('data', chunk => this.appendLog(chunk.toString()))
      .on('end', () => {
        this.setState({ status: 'completed' })
        this.props.completeSection()
      })
  }

  colorizeLog = (log, key) => {
    if (log.includes('[WARNING]')) {
      return (
        <pre key={key} className="log" style={{ color: '#d6cc75' }}>
          {log.replace('[WARNING]', '')}
        </pre>
      )
    } else if (log.includes('[SUCCESS]')) {
      return (
        <pre key={key} className="log" style={{ color: '#42c88a' }}>
          {log.replace('[SUCCESS]', '')}
        </pre>
      )
    } else if (log.includes('[ERROR]')) {
      return (
        <pre key={key} className="log" style={{ color: '#f65353' }}>
          {log.replace('[ERROR]', '')}
        </pre>
      )
    } else if (log.includes('[TITLE]')) {
      return (
        <b>
          <pre key={key} className="log" style={{ color: '#89c4f4' }}>
            {log.replace('[TITLE]', '')}
          </pre>
        </b>
      )
    }

    return (
      <pre key={key} className="log">
        {log.replace('[INFO]', '')}
      </pre>
    )
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
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {this.state.logs.length > 0 && (
              <Segment inverted>
                {this.state.logs.map((log, idx) => this.colorizeLog(log, idx))}
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
