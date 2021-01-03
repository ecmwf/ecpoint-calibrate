import React, { Component } from 'react'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import { Button, Item, Label } from 'semantic-ui-react'
import _ from 'lodash'

import client from '~/utils/client'
import toast from '~/utils/toast'
import { realNumbers } from '~/utils/patterns'
import { validateThresholdSequence } from './core'

class SparseBreakpoints extends Component {
  componentDidMount() {
    this.props.breakpoints.length === 0 && this.postThrGridIn()
  }

  getBlankRow = index =>
    [{ readOnly: true, value: index }].concat(
      _.flatMap(this.props.fields, _ => [{ value: '' }, { value: '' }])
    )

  appendBlankRow = () => {
    const newGrid = this.props.sparseBreakpoints.concat([
      this.getBlankRow(this.props.sparseBreakpoints.length),
    ])

    this.props.setSparseBreakpoints(newGrid)
  }

  getThresholdSequences() {
    const records = this.props.sparseBreakpoints
      .slice(1)
      .map(row => _.flatMap(row.slice(1), cell => cell.value))

    const chunkedRecords = records.map(row => _.chunk(row, 2))
    const transposedChunkedRecords = chunkedRecords[0].map((_, colIndex) =>
      chunkedRecords.map(row => row[colIndex])
    )

    return transposedChunkedRecords.map(row => _.flatten(row))
  }

  validateThresholdSequences = () =>
    this.getThresholdSequences().map((sequence, idx) =>
      validateThresholdSequence(
        sequence,
        this.props.fieldRanges[this.props.fields[idx]]
      )
    )

  hasError = () => !_.every(this.validateThresholdSequences())

  postThrGridIn = () => {
    this.setState({ loading: 'Generating weather types.' })

    const labels = this.props.labels
    const records = this.props.sparseBreakpoints
      .slice(1)
      .map(row => _.flatMap(row.slice(1), cell => cell.value))

    client
      .post('/postprocessing/create-wt-matrix', { labels, records })
      .then(response => {
        this.props.setBreakpoints(labels, response.data.matrix)
        this.setState({ loading: false })
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
  }

  render = () => {
    return (
      <Item>
        <Item.Content style={{ display: 'grid' }}>
          <Item.Header>
            <h5>Input the threshold breakpoints in the following spreadsheet:</h5>
          </Item.Header>
          <Item.Description style={{ overflowX: 'scroll' }}>
            <ReactDataSheet
              data={this.props.sparseBreakpoints}
              valueRenderer={cell => cell.value}
              onContextMenu={(e, cell, i, j) =>
                cell.readOnly ? e.preventDefault() : null
              }
              onCellsChanged={changes => {
                const grid = this.props.sparseBreakpoints.map(row => [...row])
                changes.forEach(({ cell, row, col, value }) => {
                  grid[row][col] = { ...grid[row][col], value }
                })
                this.props.setSparseBreakpoints(grid)
              }}
              rowRenderer={props => (
                <tr>
                  {props.children}
                  {props.row > 0 && (
                    <Button
                      icon="delete"
                      circular
                      onClick={() => {
                        const grid = this.props.sparseBreakpoints.map(row => [...row])
                        grid.splice(props.row, 1)
                        this.props.setSparseBreakpoints(grid)
                      }}
                      size="mini"
                      disabled={props.row === 1 ? true : null}
                    />
                  )}
                </tr>
              )}
              cellRenderer={props => {
                const predictorIdx = parseInt((props.col - 1) / 2)
                return (
                  <td
                    {...props}
                    style={{
                      backgroundColor: !this.validateThresholdSequences()[predictorIdx]
                        ? '#FEF6F6'
                        : null,
                    }}
                  />
                )
              }}
            />
          </Item.Description>
          <Item.Extra>
            <Button
              content="Generate WTs"
              floated="right"
              size="mini"
              onClick={() => this.postThrGridIn()}
              disabled={this.hasError()}
              primary
            />
            <Button
              content="Add row"
              floated="right"
              primary
              size="mini"
              onClick={() => this.appendBlankRow()}
            />
            <br />
            Valid values are <Label>-inf</Label>, <Label>inf</Label>, and all integers.
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  }
}

export default SparseBreakpoints
