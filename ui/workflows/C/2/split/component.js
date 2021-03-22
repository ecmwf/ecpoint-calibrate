import React, { Component } from 'react'

import {
  Modal,
  Button,
  Dimmer,
  Loader,
  Input,
  Dropdown,
  Radio,
  Segment,
  Grid,
  Divider,
  Header,
  Table,
  Image,
  Container,
} from 'semantic-ui-react'

import { remote } from 'electron'
import _ from 'lodash'

import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'
import flow from 'lodash/fp/flow'

import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'
import { realNumbers } from '~/utils/patterns'

const mainProcess = remote.require('./server')

const defaultState = {
  customSplitValue: '',
  customSplitLevel: '',
  auto: false,
  numBreakpoints: '',
  definitiveBreakpoints: [],
  primaryBreakpoints: [],
  selectedPrimaryBreakpointIdx: null,
  selectedDefinitiveBreakpointIdx: null,
  iteration: 0,
  loading: false,
  graph: null,
}

class Split extends Component {
  state = defaultState

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      customSplitLevel:
        !_.isEmpty(props.nodeMeta) && state.customSplitLevel === ''
          ? props.nodeMeta.level === props.fields.length - 1
            ? props.nodeMeta.level
            : props.nodeMeta.level === -1
            ? 0
            : props.nodeMeta.level
          : state.customSplitLevel,
    }
  }

  split = (value, level, matrix) => {
    const idx = this.props.nodeMeta.idxWT

    const source = [...matrix[idx]]
    const newWt = [...matrix[idx]]

    newWt[level * 2] = value
    newWt[level * 2 + 1] = source[level * 2 + 1]
    source[level * 2 + 1] = value

    return [..._.slice(matrix, 0, idx), source, newWt, ..._.slice(matrix, idx + 1)]
  }

  getMatrixAfterSplit = () => {
    let matrix = [...this.props.breakpoints.map(row => [..._.flatMap(row.slice(1))])]

    const values = this.state.auto
      ? flow(
          sortBy(_.identity),
          reverse,
          map(el => el.toString())
        )(this.state.definitiveBreakpoints)
      : [this.state.customSplitValue]

    values.forEach(value => {
      matrix = this.split(value, this.state.customSplitLevel, matrix)
    })

    return [matrix, values.length]
  }

  numberValueHasError = value => {
    return value === '' || realNumbers.test(value) ? null : true
  }

  getLevelOptions = () => {
    const level =
      this.props.nodeMeta.level + 1 === this.props.fields.length
        ? this.props.nodeMeta.level
        : this.props.nodeMeta.level === -1
        ? 0
        : this.props.nodeMeta.level

    const validLevels = _.slice(this.props.fields, level)

    return validLevels.map(field => ({
      key: field,
      text: field,
      value: this.props.fields.indexOf(field),
    }))
  }

  launchKS_test = (lowerBound, upperBound) => {
    this.setState({ loading: true })
    client
      .post('/postprocessing/breakpoints/suggest', {
        labels: this.props.labels,
        thrWT: this.props.breakpoints.map(row => _.flatMap(row.slice(1)))[
          this.props.nodeMeta.idxWT
        ],
        path: this.props.path,
        predictor: this.props.fields[this.state.customSplitLevel],
        numBreakpoints: this.state.numBreakpoints,
        cheaper: this.props.cheaper,
        lowerBound,
        upperBound,
      })
      .then(response => {
        this.setState({
          primaryBreakpoints: response.data.records,
          definitiveBreakpoints:
            lowerBound || upperBound ? this.state.definitiveBreakpoints : [],
          selectedPrimaryBreakpointIdx: null,
          selectedDefinitiveBreakpointIdx: null,
          graph: response.data.figure,
        })
      })
      .catch(errorHandler)
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  getSimulatedMFsButton = () =>
    this.state.definitiveBreakpoints.length > 0 && (
      <Button
        content="Save suggested MFs"
        onClick={() => {
          const path = mainProcess.selectDirectory()

          if (path === null) {
            return
          }

          const [matrix, nSplits] = this.getMatrixAfterSplit()

          client
            .post('/postprocessing/get-wt-codes', {
              labels: this.props.labels,
              matrix,
            })
            .then(response => {
              const thrGridOut = matrix.map((row, idx) =>
                _.concat(response.data.codes[idx], row)
              )
              const patches = _.slice(
                thrGridOut,
                this.props.nodeMeta.idxWT,
                this.props.nodeMeta.idxWT + nSplits + 1
              )

              client
                .post('/postprocessing/save-wt-histograms', {
                  labels: this.props.labels,
                  thrGridOut: patches,
                  path: this.props.path,
                  yLim: this.props.yLim,
                  bins: this.props.bins,
                  destinationDir: path,
                  cheaper: this.props.cheaper,
                })
                .then(response => console.log(response.data))
                .catch(errorHandler)
            })
            .catch(errorHandler)
        }}
      />
    )

  getSwitcher() {
    return (
      this.state.primaryBreakpoints.length === 0 && (
        <Segment>
          <Grid columns={3} stackable textAlign="center">
            <Grid.Row verticalAlign="middle">
              <Grid.Column textAlign="left">
                <Radio
                  toggle
                  label="Run K-S test"
                  onChange={() => this.setState({ auto: !this.state.auto })}
                  checked={this.state.auto}
                />
              </Grid.Column>
              <Grid.Column>
                <Input
                  disabled={!this.state.auto}
                  error={this.numberValueHasError(this.state.numBreakpoints)}
                  value={this.state.numBreakpoints}
                  onChange={e => this.setState({ numBreakpoints: e.target.value })}
                  label={
                    <Dropdown
                      scrolling
                      disabled={!this.state.auto}
                      options={this.getLevelOptions()}
                      onChange={(e, { value }) =>
                        this.setState({ customSplitLevel: value })
                      }
                      value={this.state.customSplitLevel}
                    />
                  }
                  labelPosition="right"
                  placeholder="Enter no. of BPs"
                />
              </Grid.Column>
              <Grid.Column width={3}>{this.getKSTestButton(true)()}</Grid.Column>
            </Grid.Row>

            <Grid.Row verticalAlign="middle">
              <Grid.Column textAlign="left">
                <Radio
                  toggle
                  label="Enter Breakpoint"
                  onChange={() => this.setState({ auto: !this.state.auto })}
                  checked={!this.state.auto}
                />
              </Grid.Column>
              <Grid.Column>
                <Input
                  disabled={this.state.auto}
                  error={this.numberValueHasError(this.state.customSplitValue)}
                  value={this.state.customSplitValue}
                  onChange={e => this.setState({ customSplitValue: e.target.value })}
                  label={
                    <Dropdown
                      scrolling
                      disabled={this.state.auto}
                      options={this.getLevelOptions()}
                      onChange={(e, { value }) => {
                        this.setState({ customSplitLevel: value })
                      }}
                      value={this.state.customSplitLevel}
                    />
                  }
                  labelPosition="right"
                  placeholder="Enter BP value"
                />
              </Grid.Column>
              <Grid.Column width={3}>{this.getSplitButton()}</Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )
    )
  }

  getPrimaryStats() {
    return (
      <Segment>
        <Grid columns={2} stackable textAlign="center">
          <Grid.Row verticalAlign="middle">
            <Divider vertical>=&gt;</Divider>
            <Grid.Column>
              <p align="left">Select one of the BPi suggested by the K-S test:</p>

              <Table celled compact definition>
                <Table.Header fullWidth>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Breakpoint</Table.HeaderCell>
                    <Table.HeaderCell>ln(p-value)</Table.HeaderCell>
                    <Table.HeaderCell>D-stat</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {this.state.primaryBreakpoints.map((each, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell collapsing>
                        <Radio
                          checked={this.state.selectedPrimaryBreakpointIdx === idx}
                          disabled={this.state.definitiveBreakpoints.includes(
                            parseFloat(each.breakpoint)
                          )}
                          onChange={() =>
                            this.setState({
                              selectedPrimaryBreakpointIdx: idx,
                              selectedDefinitiveBreakpointIdx: null,
                              definitiveBreakpoints:
                                this.state.definitiveBreakpoints.length ===
                                this.state.iteration
                                  ? _.sortBy([
                                      ...this.state.definitiveBreakpoints,
                                      parseFloat(each.breakpoint),
                                    ])
                                  : _.sortBy([
                                      ..._.slice(
                                        this.state.definitiveBreakpoints,
                                        0,
                                        this.state.iteration
                                      ),
                                      parseFloat(each.breakpoint),
                                    ]),
                            })
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>{each.breakpoint}</Table.Cell>
                      <Table.Cell>{each.pValue}</Table.Cell>
                      <Table.Cell>{each.dStatValue}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Grid.Column>

            <Grid.Column>
              <Grid divided="vertically">
                <Grid.Row>
                  <Grid.Column>Visualizer for min and max BPs TBA</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  {this.state.graph !== null && (
                    <Image src={`data:image/jpeg;base64,${this.state.graph}`} fluid />
                  )}
                </Grid.Row>
                <Grid.Row>
                  <Grid columns={3} stackable textAlign="center">
                    <h4>Re-run the K-S test from scratch</h4>
                    <Grid.Row>
                      <Grid.Column>
                        <Header as="h4" icon>
                          Consider variable
                        </Header>
                        <br />
                        <Dropdown
                          scrolling
                          selection
                          fluid
                          options={this.getLevelOptions()}
                          onChange={(e, { value }) =>
                            this.setState({ customSplitLevel: value })
                          }
                          value={this.state.customSplitLevel}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h4" icon>
                          No. of BPs
                        </Header>
                        <br />
                        <Input
                          fluid
                          error={this.numberValueHasError(this.state.numBreakpoints)}
                          value={this.state.numBreakpoints}
                          onChange={e =>
                            this.setState({ numBreakpoints: e.target.value })
                          }
                        />
                      </Grid.Column>
                      <Grid.Column style={{ marginTop: '34px' }}>
                        {this.getKSTestButton(false)()}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }

  getSecondaryStats() {
    return (
      this.state.definitiveBreakpoints.length > 0 && (
        <Segment>
          <Grid columns={2} stackable textAlign="center">
            <Grid.Row verticalAlign="middle">
              <Divider vertical>=&gt;</Divider>
              <Grid.Column>
                <Grid.Row>
                  <Container textAlign="left">
                    <h4>Definitive breakpoints:</h4>
                  </Container>
                  <Table celled compact definition>
                    <Table.Header fullWidth>
                      <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell textAlign="center">
                          Breakpoint
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {this.state.definitiveBreakpoints.map((each, idx) => (
                        <Table.Row key={idx}>
                          <Table.Cell collapsing>
                            <Radio
                              checked={
                                this.state.selectedDefinitiveBreakpointIdx === idx
                              }
                              onChange={() =>
                                this.setState({ selectedDefinitiveBreakpointIdx: idx })
                              }
                            />
                          </Table.Cell>

                          <Table.Cell textAlign="center">{each}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Grid.Row>
                <Grid.Row>
                  <Grid padded>
                    <Grid.Row columns={2}>
                      <Grid.Column>{this.getSimulatedMFsButton()}</Grid.Column>
                      <Grid.Column>{this.getSplitButton()}</Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Row>
              </Grid.Column>

              <Grid.Column>
                <Button.Group>
                  <Button
                    disabled={this.state.selectedDefinitiveBreakpointIdx === null}
                    onClick={() => {
                      this.setState({
                        selectedPrimaryBreakpointIdx: null,
                        selectedDefinitiveBreakpointIdx: null,
                        iteration: this.state.iteration + 1,
                      })

                      const idx = this.state.selectedDefinitiveBreakpointIdx
                      const breakpoints = this.state.definitiveBreakpoints

                      const lowerBound = idx === 0 ? '-inf' : breakpoints[idx - 1]

                      // Set the Upper Bound here.
                      this.launchKS_test(lowerBound, breakpoints[idx])
                    }}
                  >
                    &lt;
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    disabled={this.state.selectedDefinitiveBreakpointIdx === null}
                    onClick={() => {
                      this.setState({
                        selectedPrimaryBreakpointIdx: null,
                        selectedDefinitiveBreakpointIdx: null,
                        iteration: this.state.iteration + 1,
                      })

                      const idx = this.state.selectedDefinitiveBreakpointIdx
                      const breakpoints = this.state.definitiveBreakpoints

                      const upperBound =
                        idx === breakpoints.length - 1 ? 'inf' : breakpoints[idx + 1]

                      // Set the Lower Bound here.
                      this.launchKS_test(breakpoints[idx], upperBound)
                    }}
                  >
                    &gt;
                  </Button>
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )
    )
  }

  getTitle = () =>
    this.isKSTestMode()
      ? `K-S test for WT${this.props.nodeMeta.code}`
      : `Computing Breakpoints for WT${this.props.nodeMeta.code}`

  getSplitButton = () => (
    <Button
      fluid
      color="green"
      content="Split"
      disabled={
        this.state.auto
          ? this.state.definitiveBreakpoints.length === 0
          : this.state.customSplitValue === '' ||
            this.state.customSplitLevel === '' ||
            this.numberValueHasError(this.state.customSplitValue)
      }
      onClick={() => {
        const [matrix, nSplits] = this.getMatrixAfterSplit()
        this.props.setBreakpoints(this.props.labels, matrix)
        this.setState(defaultState)
        this.props.onClose()
      }}
    />
  )

  getKSTestButton = fluid => (lowerBound, upperBound) => (
    <Button
      fluid={fluid}
      content="Run K-S test"
      positive
      disabled={
        !this.state.auto ||
        !this.state.numBreakpoints ||
        this.numberValueHasError(this.state.numBreakpoints)
      }
      onClick={() => this.launchKS_test(lowerBound, upperBound)}
    />
  )

  isKSTestMode = () => this.state.auto && this.state.primaryBreakpoints.length > 0

  render = () => {
    return (
      !_.isEmpty(this.props.nodeMeta) && (
        <Modal
          size={this.isKSTestMode() ? 'fullscreen' : 'large'}
          open={this.props.open}
          onClose={() => {
            this.setState(defaultState)
            this.props.onClose()
          }}
        >
          <Modal.Header>{this.getTitle()}</Modal.Header>
          <Modal.Content>
            {this.getSwitcher()}
            {this.isKSTestMode() && this.getPrimaryStats()}
            {this.isKSTestMode() && this.getSecondaryStats()}
            <Dimmer active={this.state.loading}>
              <Loader indeterminate>
                Running Kolmogorov-Smirnov test. Please wait.
              </Loader>
            </Dimmer>
          </Modal.Content>
        </Modal>
      )
    )
  }
}

export default Split
