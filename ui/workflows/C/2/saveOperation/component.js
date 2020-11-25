import React, { Component } from 'react'

import { Modal, Input, Button, Segment, Label, Icon } from 'semantic-ui-react'

import semver from 'semver'
import { remote } from 'electron'

import client from '~/utils/client'
import toast from '~/utils/toast'
import download from '~/utils/download'

const mainProcess = remote.require('./server')

class SaveOperation extends Component {
  state = {
    family: null,
    version: null,
    accumulation: null,
    inf: 'inf',
    mfcols: null,
    outPath: null,
  }

  isEmpty = () => {
    if (this.props.mode === 'mf') {
      return !this.state.mfcols || !this.state.outPath
    } else if (this.props.mode === 'wt') {
      return !this.state.outPath
    } else if (this.props.mode === 'breakpoints') {
      return !this.state.inf || !this.state.outPath
    } else {
      return (
        !this.state.family ||
        !this.state.version ||
        !this.state.inf ||
        !this.state.mfcols ||
        !this.state.outPath
      )
    }
  }

  getMetadataComponent = () => (
    <Segment padded>
      <h5>Enter operation metadata:</h5>
      <Input
        label="Family*"
        placeholder="rainfall"
        value={this.state.family}
        onChange={e => this.setState({ family: e.target.value })}
      />{' '}
      <Input
        label="Version*"
        error={this.state.version && semver.valid(this.state.version) === null}
        value={this.state.version}
        onChange={e => this.setState({ version: e.target.value })}
      />{' '}
      <Input
        label="Accumulation (in hours)"
        value={this.state.accumulation}
        onChange={e => this.setState({ accumulation: e.target.value })}
      />

    <br/><br/>
    <p>Fields marked with * are mandatory.</p>
    </Segment>
  )

  getBreakpointsCSVComponent = () => (
    <Segment padded>
      <h5>Enter parameters for saving breakpoints in Weather Types as CSV:</h5>
      <Input
        label="Infinity value"
        value={this.state.inf}
        onChange={e => this.setState({ inf: e.target.value })}
      />
    </Segment>
  )

  getMFsCSVComponent = () => (
    <Segment padded>
      <h5>Enter parameters for saving MFs as CSV:</h5>
      <Input
        label="No. of columns"
        value={this.state.mfcols}
        onChange={e => this.setState({ mfcols: e.target.value })}
      />
    </Segment>
  )

  getOutputPathComponent = () => (
    <Segment padded>
      <h5>Select output path:</h5>
      <Button
        as="div"
        labelPosition="right"
        onClick={() => {
          let path

          if (this.props.mode === 'all' || this.props.mode === 'wt') {
            path = mainProcess.selectDirectory() || null
          } else if (this.props.mode === 'mf') {
            path = mainProcess.saveFile(`${this.props.error}.csv`) || null
          } else if (this.props.mode === 'breakpoints') {
            path = mainProcess.saveFile('BreakPointsWT.csv') || null
          }

          path !== null && this.setState({ outPath: path })
        }}
      >
        <Button icon>
          <Icon name="save" />
          Browse
        </Button>
        {this.state.outPath !== null && (
          <Label basic pointing="left">
            {this.state.outPath}
          </Label>
        )}
      </Button>
    </Segment>
  )

  getHeader = () => (this.props.mode === 'all' ? 'Save Operation Files' : 'Save data')

  getBreakpointsCSV = () => {
    const rows = this.props.breakpoints
      .map(row => row.map(cell => cell.replace('inf', this.state.inf)).join(','))
      .join('\n')
    return [['WT code', ...this.props.labels], rows].join('\n')
  }

  save = () => {
    this.props.setLoading('Saving...')
    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))

    client
      .post('/postprocessing/save', {
        labels: this.props.labels,
        yLim: this.props.yLim, // for mode === "wt"
        bins: this.props.bins, // for mode === "wt"
        thrGridOut: this.props.breakpoints,
        matrix,
        pdtPath: this.props.path,
        cheaper: this.props.cheaper,
        mode: this.props.mode,
        breakpointsCSV:
          this.props.mode === 'breakpoints' || this.props.mode === 'all'
            ? this.getBreakpointsCSV()
            : null,
        ...this.state,
      })
      .then(response => {
        toast.success('Successfully saved operation files')
        this.props.setLoading(false)
      })
      .catch(e => {
        console.error(e)
        if (e.response !== undefined) {
          console.error(`Error response: ${e.response}`)
          toast.error(`${e.response.status} ${e.response.statusText}`)
        } else {
          toast.error('Empty response from server')
        }
      })
      .then(() => {
        this.props.setLoading(false)
        this.props.onClose()
      })
  }

  render = () => {
    return (
      this.props.mode !== null && (
        <Modal size={'large'} open={this.props.open} onClose={this.props.onClose}>
          <Modal.Header>{this.getHeader()}</Modal.Header>
          <Modal.Content>
            {this.props.mode === 'all' && this.getMetadataComponent()}
            {(this.props.mode === 'all' || this.props.mode === 'breakpoints') &&
              this.getBreakpointsCSVComponent()}
            {(this.props.mode === 'all' || this.props.mode === 'mf') &&
              this.getMFsCSVComponent()}
            {this.getOutputPathComponent()}
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              icon="checkmark"
              content="Save"
              disabled={this.isEmpty()}
              onClick={() => this.save()}
            />
          </Modal.Actions>
        </Modal>
      )
    )
  }
}

export default SaveOperation
