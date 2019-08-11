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
import download from '~/utils/download'

const SortableItem = SortableElement(({ value }) => (
  <Segment secondary textAlign="center">
    {value}
  </Segment>
))

const SortableList = SortableContainer(({ items }) => (
  <Segment.Group raised size="mini">
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </Segment.Group>
))

class PostProcessing extends Component {
  state = { tree: null }

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
            rowRenderer={props => (
              <tr>
                {props.children}
                {props.row > 0 && (
                  <Button
                    icon
                    circular
                    onClick={() => {
                      const grid = this.props.thrGridIn.map(row => [...row])
                      grid.splice(props.row, 1)
                      this.props.onThresholdSplitsChange(grid)
                    }}
                    size="mini"
                    disabled={props.row === 1 ? true : null}
                  >
                    <Icon name="delete" />
                  </Button>
                )}
              </tr>
            )}
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
        url: '/postprocessing/create-wt-matrix',
        body: { labels, records },
        json: true,
      },
      (err, httpResponse, { matrix }) => {
        const grid = matrix.map((row, idx) =>
          _.concat([
            '',
            ...row.map(col => ({
              value: col,
              readOnly: idx === 0 ? true : false,
            })),
          ])
        )
        this.props.onWeatherTypeMatrixChange(grid)
      }
    )
  }

  postThrGridOut() {
    const labels = this.props.thrGridOut[0].slice(1).map(cell => cell.value)

    const records = this.props.thrGridOut
      .slice(1)
      .map(row => _.flatMap(row.slice(1), cell => cell.value))

    client.post(
      {
        url: '/postprocessing/create-decision-tree',
        body: { labels, records, path: this.props.path },
        json: true,
      },
      (err, httpResponse, tree) => this.setState({ tree })
    )
  }

  saveError() {
    const labels = this.props.thrGridOut[0].slice(1).map(cell => cell.value)

    const records = this.props.thrGridOut
      .slice(1)
      .map(row => _.flatMap(row.slice(1), cell => cell.value))

    client.post(
      {
        url: '/postprocessing/create-error-rep',
        body: { labels, records, path: this.props.path },
        json: true,
      },
      (err, httpResponse, body) => download('error.csv', body)
    )
  }

  getDecisionTree = () =>
    this.props.thrGridOut && (
      <Item>
        <Item.Content>
          <br />
          <Grid centered>
            <Button
              icon
              labelPosition="left"
              primary
              size="medium"
              onClick={() => this.postThrGridOut()}
            >
              <Icon name="refresh" /> Generate Decision Tree
            </Button>
            <Button
              content="Save error"
              icon="download"
              labelPosition="left"
              floated="right"
              onClick={() => this.saveError()}
            />
          </Grid>
          <br />
          {this.state.tree && <Tree data={this.state.tree} />}
        </Item.Content>
      </Item>
    )

  getDecisionTreeOutMatrix = () => (
    <Item>
      <Item.Content>
        <br />
        <Grid centered>
          <Button
            disabled={this.hasError()}
            icon
            labelPosition="left"
            primary
            size="medium"
            onClick={() => this.postThrGridIn()}
          >
            <Icon name="refresh" /> Generate Weather Types matrix
          </Button>
        </Grid>
        <br />
        {this.props.thrGridOut && (
          <ReactDataSheet
            data={this.props.thrGridOut}
            valueRenderer={cell => cell.value}
            onContextMenu={(e, cell, i, j) =>
              cell.readOnly ? e.preventDefault() : null
            }
            onCellsChanged={changes => {
              const grid = this.props.thrGridOut.map(row => [...row])
              changes.forEach(({ cell, row, col, value }) => {
                grid[row][col] = { ...grid[row][col], value }
              })
              this.props.onWeatherTypeMatrixChange(grid)
            }}
            rowRenderer={props => (
              <tr>
                {props.children}
                {props.row > 0 && (
                  <Button
                    icon
                    circular
                    onClick={() => {
                      const grid = this.props.thrGridOut.map(row => [...row])
                      grid.splice(props.row, 1)
                      this.props.onWeatherTypeMatrixChange(grid)
                    }}
                    size="mini"
                    disabled={props.row === 1 ? true : null}
                  >
                    <Icon name="delete" />
                  </Button>
                )}
              </tr>
            )}
          />
        )}
      </Item.Content>
    </Item>
  )

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
          <Card fluid color="black">
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
                  {this.getDecisionTreeOutMatrix()}
                  {this.getDecisionTree()}
                </Item.Group>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
}

export default PostProcessing
