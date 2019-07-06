import React, { Component } from 'react'

import {
  Grid,
  Card,
  Button,
  Icon,
  Label,
  Table,
  Segment,
  Item,
} from 'semantic-ui-react'

import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import Tree from './tree'

import client from '~/utils/client'

const SortableItem = SortableElement(({ value }) => (
  <Segment secondary textAlign="center">
    {value}
  </Segment>
))

const SortableList = SortableContainer(({ items }) => {
  return (
    <Segment.Group raised size="mini">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </Segment.Group>
  )
})

class PostProcessing extends Component {
  state = { thrGridOut: null }

  getThresholdSplitsGridSheet = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Input the threshold breakpoints in the following spreadsheet:</h5>
        </Item.Header>
        <Item.Description>
          <ReactDataSheet
            data={this.props.thrGridIn}
            valueRenderer={cell => cell.value}
            onContextMenu={(e, cell, i, j) =>
              cell.readOnly ? e.preventDefault() : null
            }
            onCellsChanged={changes => {
              const grid = this.props.thrGridIn.map(row => [...row])
              changes.forEach(({ cell, row, col, value }) => {
                grid[row][col] = { ...grid[row][col], value }
              })
              this.props.onThresholdSplitsChange(grid)
            }}
          />
        </Item.Description>
        <Item.Extra>
          <Button
            floated="right"
            icon
            labelPosition="left"
            primary
            size="mini"
            onClick={() => this.appendBlankRow()}
          >
            <Icon name="add circle" /> Add row
          </Button>
          <br />
          Valid values are <Label>-inf</Label>, <Label>inf</Label>, and all integers.
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  getBlankRow = index =>
    [{ readOnly: true, value: index }].concat(
      _.flatMap(this.props.fields, _ => [{ value: '' }, { value: '' }])
    )

  appendBlankRow = () => {
    const newGrid = this.props.thrGridIn.concat([
      this.getBlankRow(this.props.thrGridIn.length),
    ])

    this.props.onThresholdSplitsChange(newGrid)
  }

  hasError() {
    // Get the grid without the header
    const grid = this.props.thrGridIn.slice(1)

    if (grid.length === 0) {
      return true
    }

    // Get the first row without the left (index) column
    const firstRow = grid[0].slice(1)

    const firstRowisValid = _.every(
      firstRow,
      cell =>
        cell.value === 'inf' ||
        cell.value === '-inf' ||
        /^(\d+\.?\d*|\.\d+)$/.test(cell.value)
    )

    if (!firstRowisValid) {
      return true
    }

    const remainingRows = grid.slice(1)

    if (remainingRows.length === 0) {
      return false
    }

    return !_.every(remainingRows, row =>
      _.every(
        row.slice(1),
        cell =>
          cell.value === '' ||
          cell.value === 'inf' ||
          cell.value === '-inf' ||
          /^(\d+\.?\d*|\.\d+)$/.test(cell.value)
      )
    )
  }

  isComplete = () => !this.hasError()

  postThrGridIn() {
    const labels = this.props.thrGridIn[0].slice(1).map(cell => cell.value)

    const records = this.props.thrGridIn
      .slice(1)
      .map(row => _.flatMap(row.slice(1), cell => cell.value))

    client.post(
      {
        url: '/postprocessing/create-naive-decision-tree',
        body: { labels, records, path: this.props.path },
        json: true,
      },
      (err, httpResponse, body) => this.setState({ thrGridOut: body })
    )
  }

  getDecisionTree = () => (
    <Grid centered>
      <Grid.Row centered>
        <Grid.Column>
          <Tree data={this.state.thrGridOut.tree} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

  getDecisionTreeOutMatrix = () => (
    <Grid centered>
      <Grid.Row centered>
        <Button
          disabled={this.hasError()}
          icon
          labelPosition="left"
          primary
          size="medium"
          onClick={() => this.postThrGridIn()}
        >
          <Icon name="refresh" /> Generate full Decision Tree
        </Button>
      </Grid.Row>

      {this.state.thrGridOut && (
        <Grid.Row centered>
          <Grid.Column>
            <Table definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  {this.state.thrGridOut.labels.map(label => (
                    <Table.HeaderCell>{label}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.thrGridOut.records.map((rows, idx) => (
                  <Table.Row>
                    <Table.Cell>WT {idx + 1}</Table.Cell>

                    {rows.map(cell => (
                      <Table.Cell>{cell}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  )

  componentWillMount() {
    this.props.setFields(this.props.fields)
  }

  getSortableFields = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Rearrange the levels of the decision tree below:</h5>
        </Item.Header>
        <Item.Description>
          <SortableList
            items={this.props.fields}
            onSortEnd={({ oldIndex, newIndex }) =>
              this.props.onFieldsSortEnd(this.props.fields, oldIndex, newIndex)
            }
          />
        </Item.Description>
        <Item.Extra>
          <small>
            <b>Note:</b> Modifying the current arrangement will clear the threshold
            breakpoints in the sheet below.
          </small>
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  render = () =>
    this.props.fields.length > 0 && (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="teal">
            <Card.Header>
              <Grid.Column floated="left">Decision Tree</Grid.Column>
              <Grid.Column floated="right">
                {this.isComplete() && <Icon name="check circle" />}
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description>
                <Item.Group divided>
                  {this.getSortableFields()}
                  {this.getThresholdSplitsGridSheet()}
                </Item.Group>
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

export default PostProcessing
