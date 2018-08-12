import React, { Component } from 'react'

import {
  Grid,
  Card,
  Button,
  Icon,
  Label,
  Table
} from 'semantic-ui-react'

import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import client from '~/utils/client'

class PostProcessing extends Component {
  getThresholdSplitsGridSheet = () => <ReactDataSheet
    data={this.props.postprocessing.thrGridIn}
    valueRenderer={(cell) => cell.value}
    onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
    onCellsChanged={changes => {
      const grid = this.props.postprocessing.thrGridIn.map(row => [...row])
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
    const newGrid = this.props.postprocessing.thrGridIn.concat(
      [this.getBlankRow(this.props.postprocessing.thrGridIn.length)]
    )

    this.props.onThresholdSplitsChange(newGrid)
  }

  componentDidMount () {
    const grid = this.generateInitialGrid()
    this.props.onThresholdSplitsChange(grid)
  }

  hasError () {
    // Get the grid without the header
    const grid = this.props.postprocessing.thrGridIn.slice(1)

    if (grid.length === 0) {
      return true
    }

    // Get the first row without the left (index) column
    const firstRow = grid[0].slice(1)

    const firstRowisValid = _.every(
      firstRow,
      cell => cell.value === 'Infinity' || cell.value === '-Infinity' || /^\d+$/.test(cell.value)
    )

    if (!firstRowisValid) {
      return true
    }

    const remainingRows = grid.slice(1)

    if (remainingRows.length === 0) {
      return false
    }

    return !_.every(
      remainingRows,
      row => _.every(
        row.slice(1),
        cell => cell.value === '' || cell.value === 'Infinity' || cell.value === '-Infinity' || /^\d+$/.test(cell.value)
      )
    )
  }

  isComplete = () => !this.hasError()

  postThrGridIn () {
    const labels = this.props.postprocessing.thrGridIn[0].slice(1).map(
      cell => cell.value
    )

    const records = this.props.postprocessing.thrGridIn.slice(1).map(
      row => _.flatMap(row.slice(1), cell => cell.value)
    )

    client.post(
      {
        url: '/postprocessing/create-naive-decision-tree',
        body: {labels, records},
        json: true
      },
      (err, httpResponse, body) => console.log(body)
    )
  }

  getFullDecisionTree () {
    return (
      <Grid centered>
        <Grid.Row centered>
          <Button
            disabled={this.hasError()}
            icon
            labelPosition='left'
            primary
            size='medium'
            onClick={() => this.postThrGridIn()}
          >
            <Icon name='refresh' /> Generate full Decision Tree
          </Button>
        </Grid.Row>

        <Grid.Row centered>
          <Grid.Column>
            <Table definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Arguments</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>reset rating</Table.Cell>
                  <Table.Cell>None</Table.Cell>
                  <Table.Cell>Resets rating to default value</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>set rating</Table.Cell>
                  <Table.Cell>rating (integer)</Table.Cell>
                  <Table.Cell>Sets the current star rating to specified value</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  render () {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color='teal'>
            <Card.Header>
              <Grid.Column floated='left'>
                Decision Tree
              </Grid.Column>
              <Grid.Column floated='right'>
                {this.isComplete() && <Icon name='check circle' />}
              </Grid.Column>
            </Card.Header>
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
                <br />
                <p>
                  Valid values are <Label>-Infinity</Label>, <Label>Infinity</Label>, and all integers.
                </p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {this.getFullDecisionTree()}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default PostProcessing
