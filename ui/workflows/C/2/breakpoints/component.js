import React, { Component } from 'react'

import { Button, Table, Popup } from 'semantic-ui-react'
import _ from 'lodash'

import { isMergeableToPreviousRow, mergeToPreviousRow } from './core'

class Breakpoints extends Component {
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
                        this.props.setBreakpoints(
                          this.props.labels,
                          matrix,
                          this.props.fieldRanges
                        )
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
