import React, { Component } from 'react'

import { Grid, Button, Table, Item, Popup } from 'semantic-ui-react'
import _ from 'lodash'

import client from '~/utils/client'

class Breakpoints extends Component {
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
                        this.props.postBreakpoints(matrix)
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
    </Table>
  )
}

export default Breakpoints
