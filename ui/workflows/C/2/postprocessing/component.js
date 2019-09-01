import React, { Component } from 'react'

import { Grid, Card, Button, Icon, Item, Input } from 'semantic-ui-react'

import _ from 'lodash'

import { remote } from 'electron'

import client from '~/utils/client'
import download from '~/utils/download'
import BreakPoints from '../breakpoints'
import SparseBreakPoints from '../sparseBreakpoints'
import Tree from '../tree'
import Levels from '../levels'

const mainProcess = remote.require('./server')
const jetpack = require('fs-jetpack')

class PostProcessing extends Component {
  state = { tree: null }

  hasError() {
    return !_.every(
      this.props.thrGridIn.slice(1),
      row =>
        _.every(
          row.slice(1),
          cell =>
            ['', 'inf', '-inf'].includes(cell.value) ||
            /^(\d+\.?\d*|\.\d+)$/.test(cell.value)
        ) && !_.every(row.slice(1), cell => cell.value === '')
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
        this.postThrGridOut(matrix)
      }
    )
  }

  getLabels = () => this.props.thrGridIn[0].slice(1).map(cell => cell.value)

  postThrGridOut = matrix => {
    /* We pass the matrix instead of using it from this.props.thrGridOut to avoid
     * concurrency issues. */
    const labels = this.getLabels()
    this.props.setBreakpoints(labels, matrix)
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
    this.props.yLim === '' || /^\d+$/.test(this.props.yLim)
      ? parseInt(this.props.yLim) > 0 && parseInt(this.props.yLim) <= 100
        ? null
        : true
      : true

  getYLimitField = () =>
    this.props.thrGridOut.length > 0 && (
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
            Valid values are all floating-point numbers in the set <code>(0, 100]</code>
            .
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
              breakpoints={this.props.thrGridOut}
              setBreakpoints={matrix => this.postThrGridOut(matrix)}
              labels={this.getLabels()}
              path={this.props.path}
              yLim={this.props.yLim}
              fields={this.props.fields}
              bins={this.props.bins}
              count={this.props.count}
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

      <Button
        content="Load breakpoints from CSV"
        icon="upload"
        labelPosition="left"
        primary
        size="medium"
        onClick={() => {
          const path = mainProcess.openFile() || null

          if (path !== null) {
            const csv = jetpack.read(path.pop())
            const data = csv.split('\n').map(row => row.split(','))
            const matrix = data.slice(1).map(row => row.slice(1))
            this.postThrGridOut(matrix)
          }
        }}
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
                  <Levels />
                  <SparseBreakPoints />

                  {this.getCTAs()}
                  {this.props.thrGridOut.length > 0 && (
                    <BreakPoints
                      setBreakpoints={matrix => this.postThrGridOut(matrix)}
                      labels={this.getLabels()}
                    />
                  )}

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
