import React, { Component } from 'react'

import { Grid, Button, Table, Item, Popup, Input } from 'semantic-ui-react'
import _ from 'lodash'

import client from '~/utils/client'
import download from '~/utils/download'

import { remote } from 'electron'
const mainProcess = remote.require('./server')
const jetpack = require('fs-jetpack')

class Breakpoints extends Component {
  state = { numColsMFs: '' }
  isMergeableToPreviousRow = row => {
    if (row === 0) {
      return false
    }

    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))

    /* B is being merged to A */
    const [A, B] = [
      _.slice(matrix[row - 1], 1).reverse(),
      _.slice(matrix[row], 1).reverse(),
    ]

    const zipped_columns = _.zip(_.chunk(A, 2), _.chunk(B, 2))

    let index = 0

    while (index !== zipped_columns.length) {
      const [[aHigh, aLow], [bHigh, bLow]] = zipped_columns[index]
      if (aLow !== '-inf' || bLow !== '-inf' || aHigh !== 'inf' || bHigh !== 'inf') {
        break
      }
      index += 1
    }

    const [
      [[aHighFirst, aLowFirst], [bHighFirst, bLowFirst]],
      ...rest
    ] = zipped_columns.slice(index)

    return aHighFirst === bLowFirst
  }

  mergeToPreviousRow = row => {
    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))

    /* B is being merged to A */
    const [A, B] = [[...matrix[row - 1]].reverse(), [...matrix[row]].reverse()]

    const zipped_columns = _.zip(_.chunk(A, 2), _.chunk(B, 2))

    let index = 0

    while (index !== zipped_columns.length) {
      const [[aHigh, aLow], [bHigh, bLow]] = zipped_columns[index]
      if (aLow !== '-inf' || bLow !== '-inf' || aHigh !== 'inf' || bHigh !== 'inf') {
        break
      }
      index += 1
    }

    const unbounded_leaves = _.flatten(_.times(index, _.constant(['-inf', 'inf'])))
    const [
      [[aHighFirst, aLowFirst], [bHighFirst, bLowFirst]],
      ...rest
    ] = zipped_columns.slice(index)

    rest.reverse()

    const newRow = [
      ...rest.flatMap(([[aHigh, aLow], [bHigh, bLow]]) => [aLow, aHigh]),
      ...[aLowFirst, bHighFirst],
      ...unbounded_leaves,
    ]

    return [..._.slice(matrix, 0, row - 1), newRow, ..._.slice(matrix, row + 1)]
  }

  numColsMFsHasError = () =>
    this.state.numColsMFs !== '' && !/^\d+$/.test(this.state.numColsMFs)

  saveError() {
    //this.setState({ loading: 'Generating Mapping Functions.' })
    const labels = this.props.labels
    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))

    client.post(
      {
        url: '/postprocessing/create-error-rep',
        body: { labels, matrix, path: this.props.path, numCols: this.state.numColsMFs },
        json: true,
      },
      (err, httpResponse, body) => {
        download('error.csv', body)
        //this.setState({ loading: false })
      }
    )
  }

  saveBreakPoints() {
    const labels = this.props.labels
    const rows = this.props.breakpoints.map(row => row.join(',')).join('\n')
    const csv = [['WT code', ...labels], rows].join('\n')
    download('BreakPointsWT.csv', csv)
  }

  render = () => (
    <Table definition>
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
              {this.isMergeableToPreviousRow(rowIdx) && (
                <Popup
                  content="Merge with the Weather Type above"
                  trigger={
                    <Button
                      icon="arrow up"
                      circular
                      onClick={() => {
                        const matrix = this.mergeToPreviousRow(rowIdx)
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
                const path = mainProcess.openFile() || null

                if (path !== null) {
                  const csv = jetpack.read(path.pop())
                  const data = csv.split('\n').map(row => row.split(','))
                  const matrix = data.slice(1).map(row => row.slice(1))
                  //this.setState({ loading: 'Generating and rendering decision tree.' })
                  this.props.setBreakpoints(this.props.labels, matrix)
                  //this.setState({ loading: false })
                }
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
