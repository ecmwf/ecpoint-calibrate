import React, { Component } from 'react'

import {
  Grid,
  Card,
  Button,
  Icon
} from 'semantic-ui-react'

import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

class PostProcessing extends Component {
  getThresholdSplitsGridSheet = () => <ReactDataSheet
    data={this.props.postprocessing.thresholdSplitsGrid}
    valueRenderer={(cell) => cell.value}
    onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
    onCellsChanged={changes => {
      const grid = this.props.postprocessing.thresholdSplitsGrid.map(row => [...row])
      changes.forEach(({cell, row, col, value}) => {
        grid[row][col] = {...grid[row][col], value}
      })
      this.props.onThresholdSplitsChange(grid)
    }}
  />

  getBlankRow = (index) => [
    {readOnly: true, value: index}
  ].concat(
    _.flatMap(
      this.props.fields.filter(field => field.isPostProcessed),
      field => [{value: ''}, {value: ''}]
    )
  )

  generateInitialGrid () {
    const header = [
      {readOnly: true, value: ''}
    ].concat(
      _.flatMap(
        this.props.fields.filter(field => field.isPostProcessed),
        field => [
          {readOnly: true, value: field.shortname + '__L'},
          {readOnly: true, value: field.shortname + '__H'}
        ]
      )
    )

    const firstRow = [this.getBlankRow(1)]

    return [header].concat(firstRow)
  }

  appendBlankRow = () => {
    const newGrid = this.props.postprocessing.thresholdSplitsGrid.concat(
      [this.getBlankRow(this.props.postprocessing.thresholdSplitsGrid.length)]
    )

    this.props.onThresholdSplitsChange(newGrid)
  }

  componentDidMount () {
    const grid = this.generateInitialGrid()
    this.props.onThresholdSplitsChange(grid)
  }

  render () {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color='teal'>
            <Card.Header>Decision Tree</Card.Header>
            <Card.Content>
              <Card.Description>
                {this.getThresholdSplitsGridSheet()}
                <br />
                <Button
                  floated='right'
                  icon
                  labelPosition='left'
                  primary
                  size='mini'
                  onClick={() => this.appendBlankRow()}
                >
                  <Icon name='add circle' /> Add row
                </Button>
              </Card.Description>
            </Card.Content>
            <Card.Content extra />
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default PostProcessing
