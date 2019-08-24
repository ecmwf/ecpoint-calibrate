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
  Popup,
  Input,
} from 'semantic-ui-react'

import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import Tree from './tree'

import client from '~/utils/client'
import download from '~/utils/download'
import BreakPoints from '../breakpoints'

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
    const labels = this.getLabels()

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
        this.props.onWeatherTypeMatrixChange(labels, matrix)
        this.postThrGridOut(matrix)
      }
    )
  }

  getLabels = () => this.props.thrGridIn[0].slice(1).map(cell => cell.value)

  postThrGridOut = matrix => {
    /* We pass the matrix instead of using it from this.props.thrGridOut to avoid
     * concurrency issues. */
    const labels = this.getLabels()
    client.post(
      {
        url: '/postprocessing/create-decision-tree',
        body: { labels, matrix },
        json: true,
      },
      (err, httpResponse, tree) => this.setState({ tree })
    )
  }

  saveError() {
    const labels = this.getLabels()
    const matrix = this.props.thrGridOut.map(row => _.flatMap(row.slice(1)))

    client.post(
      {
        url: '/postprocessing/create-error-rep',
        body: { labels, matrix, path: this.props.path },
        json: true,
      },
      (err, httpResponse, body) => download('error.csv', body)
    )
  }

  saveBreakPoints() {
    const labels = this.getLabels()
    const rows = this.props.thrGridOut.map(row => row.join(',')).join('\n')
    const csv = [['WT code', ...labels], rows].join('\n')
    download('BreakPointsWT.csv', csv)
  }

  yLimHasError = () =>
    this.props.yLim === '' || /^(\d+\.?\d*|\.\d+)$/.test(this.props.yLim)
      ? parseFloat(this.props.yLim) > 0 && parseFloat(this.props.yLim) <= 1.0
        ? null
        : true
      : true

  getYLimitField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter maximum value of Y-axis in the histograms:</h5>
        </Item.Header>
        <Item.Description>
          <Input
            value={this.props.yLim || ''}
            error={this.yLimHasError()}
            onChange={e => this.props.onYLimChange(e.target.value)}
          />
        </Item.Description>
        <Item.Extra>
          Valid values are all floating-point numbers in the set <code>(0, 1]</code>.
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  getDecisionTree = () =>
    this.props.thrGridOut.length > 0 && (
      <Item>
        <Item.Content>
          <br />
          {!this.yLimHasError() && this.state.tree && (
            <Tree
              data={this.state.tree}
              thrGridOut={this.props.thrGridOut}
              labels={this.getLabels()}
              path={this.props.path}
              yLim={this.props.yLim}
            />
          )}
        </Item.Content>
      </Item>
    )

  getCTAs = () => (
    <Grid centered>
      <Button
        content="Generate Weather Types matrix"
        disabled={this.hasError()}
        icon="refresh"
        labelPosition="left"
        primary
        size="medium"
        onClick={() => this.postThrGridIn()}
      />
      {this.props.thrGridOut.length > 0 && (
        <>
          <Button
            content="Save mapping functions as CSV"
            icon="download"
            labelPosition="left"
            floated="right"
            onClick={() => this.saveError()}
          />
          <Button
            content="Save breakpoints as CSV"
            icon="download"
            labelPosition="left"
            floated="right"
            onClick={() => this.saveBreakPoints()}
          />
        </>
      )}
    </Grid>
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
      <Grid padded>
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
                  <Item>
                    <Item.Content>
                      {this.getCTAs()}
                      {this.props.thrGridOut.length > 0 && (
                        <BreakPoints
                          setBreakpoints={matrix => this.postThrGridOut(matrix)}
                          labels={this.getLabels()}
                        />
                      )}
                    </Item.Content>
                  </Item>
                  {this.getYLimitField()}
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
