import React, { Component } from 'react'

import {
  Grid,
  Card
} from 'semantic-ui-react'

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

  render () {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color='teal'>
            <Card.Header>Decision Tree</Card.Header>
            <Card.Content>
              <Card.Description>
                {this.getThresholdSplitsGridSheet()}
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
