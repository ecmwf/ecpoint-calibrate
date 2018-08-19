import React, { Component } from 'react'

import {
  Grid,
  Card,
  Button,
  Icon,
  Label,
  Table,
  Modal,
  Image
} from 'semantic-ui-react'

import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import Tree from './tree'

import client from '~/utils/client'

class PostProcessing extends Component {
  state = {thrGridOut: null}

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
          {readOnly: true, value: field.shortname + '_thrL'},
          {readOnly: true, value: field.shortname + '_thrH'}
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
      cell => cell.value === 'inf' || cell.value === '-inf' || /^(\d+\.?\d*|\.\d+)$/.test(cell.value)
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
        cell => cell.value === '' || cell.value === 'inf' || cell.value === '-inf' || /^(\d+\.?\d*|\.\d+)$/.test(cell.value)
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
        body: {labels, records, outPath: this.props.parameters.outPath},
        json: true
      },
      (err, httpResponse, body) => this.setState({thrGridOut: body})
    )
  }

  getDecisionTree () {
    return (
      <Grid centered>
        <Grid.Row centered>
          <Tree data={this.state.thrGridOut.tree} />
        </Grid.Row>
      </Grid>
    )
  }

  getDecisionTreeOutMatrix () {
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

        {
          this.state.thrGridOut && <Grid.Row centered>
            <Grid.Column>
              <Table definition>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell />
                    {
                      this.state.thrGridOut.labels.map(
                        label => <Table.HeaderCell>{label}</Table.HeaderCell>
                      )
                    }
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    this.state.thrGridOut.records.map(
                      (rows, idx) => (
                        <Table.Row>
                          <Table.Cell>
                            WT {idx + 1}
                          </Table.Cell>

                          {
                            rows.map(
                              cell => <Table.Cell>{cell}</Table.Cell>
                            )
                          }
                        </Table.Row>
                      )
                    )
                  }
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        }
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

                Valid values are <Label>-inf</Label>, <Label>inf</Label>, and all integers.

              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {this.getDecisionTreeOutMatrix()}

              {this.state.thrGridOut && this.getDecisionTree()}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default PostProcessing
