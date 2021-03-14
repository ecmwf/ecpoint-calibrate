import React, { Component } from 'react'

import { Button, Table, Popup, Input } from 'semantic-ui-react'
import _ from 'lodash'

import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'
import download from '~/utils/download'

import { isMergeableToPreviousRow, mergeToPreviousRow } from './core'

import { remote } from 'electron'
const mainProcess = remote.require('./server')
const jetpack = require('fs-jetpack')

class Breakpoints extends Component {
  state = { numColsMFs: '' }

  numColsMFsHasError = () =>
    this.state.numColsMFs !== '' && !/^\d+$/.test(this.state.numColsMFs)

  saveError() {
    this.props.setLoading('Generating Mapping Functions.')
    const labels = this.props.labels
    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))

    client
      .post('/postprocessing/create-error-rep', {
        labels,
        matrix,
        path: this.props.path,
        numCols: this.state.numColsMFs,
        cheaper: this.props.cheaper,
      })
      .then(response => {
        this.props.setLoading(false)
        download(`${this.props.error}.csv`, response.data)
      })
      .catch(errorHandler)
  }

  saveBreakPoints() {
    const labels = this.props.labels
    const rows = this.props.breakpoints
      .map(row => row.map(cell => cell.replace('inf', '9999')).join(','))
      .join('\n')
    const csv = [['WT code', ...labels], rows].join('\n')
    download('BreakPointsWT.csv', csv)
  }

  render = () => (
    <Table definition size="small" style={{ display: 'block', overflowX: 'scroll' }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>WT code</Table.HeaderCell>
          {this.props.labels.map((label, idx) => (
            <Table.HeaderCell key={idx}>{label}</Table.HeaderCell>
          ))}
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {this.props.breakpoints.map((rows, rowIdx) => (
          <Table.Row key={rowIdx}>
            {rows.map((cell, colIdx) => (
              <Table.Cell key={colIdx}>{cell}</Table.Cell>
            ))}

            <Table.Cell>
              {isMergeableToPreviousRow(
                rowIdx,
                this.props.breakpoints.map(row => _.flatMap(row.slice(1)))
              ) && (
                <Popup
                  content="Merge with the Weather Type above"
                  trigger={
                    <Button
                      icon="arrow up"
                      circular
                      onClick={() => {
                        const matrix = mergeToPreviousRow(
                          rowIdx,
                          this.props.breakpoints.map(row => _.flatMap(row.slice(1)))
                        )
                        this.props.setBreakpoints(this.props.labels, matrix)
                      }}
                      size="mini"
                    />
                  }
                />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan={this.props.labels.length + 2}>
            <Button
              content="Upload CSV"
              icon="upload"
              labelPosition="left"
              primary
              size="tiny"
              onClick={() => {
                const path = mainProcess.openFile()
                if (path === null) {
                  return
                }

                const csv = jetpack.read(path)
                const data = csv.split('\n').map(row => row.split(','))
                const matrix = data.slice(1).map(row => row.slice(1))
                this.props.setLoading('Generating and rendering decision tree.')
                this.props.setBreakpoints(this.props.labels, matrix)
                this.props.setLoading(false)
              }}
            />

            <Button
              content="Save as CSV"
              icon="download"
              labelPosition="left"
              floated="right"
              size="tiny"
              onClick={() => this.saveBreakPoints()}
            />
            <Input
              action={{
                labelPosition: 'left',
                icon: 'download',
                content: 'Save MFs as CSV',
                floated: 'right',
                onClick: () => this.saveError(),
                disabled: this.state.numColsMFs === '' || this.numColsMFsHasError(),
                size: 'tiny',
              }}
              actionPosition="left"
              placeholder="Enter no. of columns"
              error={this.numColsMFsHasError()}
              onChange={e => this.setState({ numColsMFs: e.target.value })}
              size="mini"
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default Breakpoints
