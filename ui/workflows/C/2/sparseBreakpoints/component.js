import React, { Component } from 'react'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import { Button, Item, Label } from 'semantic-ui-react'
import _ from 'lodash'

import client from '~/utils/client'

class SparseBreakpoints extends Component {
  getBlankRow = index =>
    [{ readOnly: true, value: index }].concat(
      _.flatMap(this.props.fields, _ => [{ value: '' }, { value: '' }])
    )

  appendBlankRow = () => {
    const newGrid = this.props.breakpoints.concat([
      this.getBlankRow(this.props.breakpoints.length),
    ])

    this.props.setBreakpoints(newGrid)
  }

  render = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Input the threshold breakpoints in the following spreadsheet:</h5>
        </Item.Header>
        <Item.Description>
          <ReactDataSheet
            data={this.props.breakpoints}
            valueRenderer={cell => cell.value}
            onContextMenu={(e, cell, i, j) =>
              cell.readOnly ? e.preventDefault() : null
            }
            onCellsChanged={changes => {
              const grid = this.props.breakpoints.map(row => [...row])
              changes.forEach(({ cell, row, col, value }) => {
                grid[row][col] = { ...grid[row][col], value }
              })
              this.props.setBreakpoints(grid)
            }}
            rowRenderer={props => (
              <tr>
                {props.children}
                {props.row > 0 && (
                  <Button
                    icon="delete"
                    circular
                    onClick={() => {
                      const grid = this.props.breakpoints.map(row => [...row])
                      grid.splice(props.row, 1)
                      this.props.setBreakpoints(grid)
                    }}
                    size="mini"
                    disabled={props.row === 1 ? true : null}
                  />
                )}
              </tr>
            )}
          />
        </Item.Description>
        <Item.Extra>
          <Button
            icon="add circle"
            content="Add row"
            floated="right"
            icon
            labelPosition="left"
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

export default SparseBreakpoints
