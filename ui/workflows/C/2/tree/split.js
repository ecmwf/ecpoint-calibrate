import React, { Component } from 'react'

import {
  Modal,
  Button,
  Dimmer,
  Loader,
  Input,
  Dropdown,
  Radio,
  Message,
  Segment,
  Grid,
} from 'semantic-ui-react'

import { remote } from 'electron'
import _ from 'lodash'

import map from 'lodash/fp/map'
import flatten from 'lodash/fp/flatten'
import reverse from 'lodash/fp/reverse'
import flow from 'lodash/fp/flow'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'
import client from '~/utils/client'
import toast from '~/utils/toast'

const mainProcess = remote.require('./server')

class Split extends Component {
  state = {
    customSplitValue: '',
    customSplitLevel: '',
    auto: false,
    minNumCases: 1000,
    numSubSamples: 20,
    msg: null,
    breakpoints: null,
    loading: false,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      customSplitLevel:
        !_.isEmpty(props.nodeMeta) && state.customSplitValue === ''
          ? props.nodeMeta.level + 1 === props.fields.length
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
          map(row => row.slice(1).map(cell => cell.value)),
          flatten,
          reverse
        )(this.state.breakpoints)
      : [this.state.customSplitValue]

    values.forEach(value => {
      matrix = this.split(value, this.state.customSplitLevel, matrix)
    })

    return [matrix, values.length]
  }

  customSplitHasError = () => {
    const value = this.state.customSplitValue
    return value === '' || /^(\d+\.?\d*|\.\d+)$/.test(value) ? null : true
  }

  generatedSplitHasError = () =>
    this.state.breakpoints === null ||
    !_.every(
      this.state.breakpoints.map(row =>
        row.slice(1).map(cell => /^(\d+\.?\d*|\.\d+)$/.test(cell.value))
      )
    )

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

  onAutoSplitToggle = () => {
    const newAutoValue = !this.state.auto
    this.setState({ auto: newAutoValue })

    newAutoValue &&
      this.validateSubSamples(this.state.numSubSamples, this.state.minNumCases)
  }

  launchKS_test = () => {
    this.setState({ loading: true })
    client
      .post('/postprocessing/get-breakpoints-suggestions', {
        labels: this.props.labels,
        thrWT: this.props.breakpoints.map(row => _.flatMap(row.slice(1)))[
          this.props.nodeMeta.idxWT
        ],
        path: this.props.path,
        predictor: this.props.fields[this.state.customSplitLevel],
        numSubSamples: this.state.numSubSamples,
        minNumCases: this.state.minNumCases,
      })
      .then(response => {
        this.setState({
          breakpoints: response.data.breakpoints.map((bp, idx) => [
            { value: idx, readOnly: true },
            { value: bp, readOnly: false },
          ]),
          loading: false,
        })
      })
      .catch(e => {
        console.error(e)
        if (e.response !== undefined) {
          console.error(`Error response: ${e.response}`)
          toast.error(`${e.response.status} ${e.response.statusText}`)
        } else {
          toast.error('Empty response from server')
        }
      })
  }

  validateSubSamples = (numSubSamples, minNumCases) => {
    if (numSubSamples === '' || minNumCases === '') {
      this.setState({ msg: null })
    } else {
      const cases = parseInt(this.props.count / numSubSamples)
      const msg =
        minNumCases < this.props.count && cases < minNumCases
          ? {
              type: 'negative',
              header: 'The size of the sub-samples to analyse is too small',
              body: [
                `Minimum no. of cases in each sub-sample: ${minNumCases}`,
                `Size of the sub-samples analysed: ${cases}`,
                'Please provide a smaller number of sub-samples.',
              ],
            }
          : {
              type: 'positive',
              header: 'Validation of the sub-sample size is successful',
              body: [
                `No. of considered sub-samples: ${numSubSamples}`,
                `No. of cases in each sub-sample: ${cases}`,
                `Minimum no. of cases in each sub-sample: ${minNumCases}`,
              ],
            }
      this.setState({ msg })
    }
  }

  getAutoSplitToggler = () => (
    <Radio
      toggle
      label="Suggest breakpoints"
      onChange={this.onAutoSplitToggle}
      defaultChecked={this.state.auto}
    />
  )

  getAutoSplitInputParameters = () =>
    this.state.auto && (
      <Segment padded="very" raised>
        <h5>Minimum no. of cases per sub-member in the mapping functions:</h5>
        <Input
          error={
            this.state.minNumCases === '' || /^\d+$/.test(this.state.minNumCases)
              ? null
              : true
          }
          value={this.state.minNumCases}
          onChange={e => {
            this.setState({ minNumCases: e.target.value })
            this.validateSubSamples(this.state.numSubSamples, e.target.value)
          }}
        />
        <h5>No. of sub-samples to analyse to define the breakpoints:</h5>
        <Input
          error={
            this.state.numSubSamples === '' || /^\d+$/.test(this.state.numSubSamples)
              ? null
              : true
          }
          value={this.state.numSubSamples}
          onChange={e => {
            this.setState({ numSubSamples: e.target.value })
            this.validateSubSamples(e.target.value, this.state.minNumCases)
          }}
        />

        {this.state.msg !== null && (
          <Message
            negative={this.state.msg.type === 'negative'}
            positive={this.state.msg.type === 'positive'}
          >
            <Message.Header>{this.state.msg.header}</Message.Header>
            {this.state.msg.body.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </Message>
        )}
      </Segment>
    )

  getSuggestionSegment = () => (
    <Grid centered>
      {this.state.auto &&
        this.state.msg !== null &&
        this.state.msg.type === 'positive' && (
          <Grid.Row>
            <Button
              content="Launch Kolmogorov-Smirnov Test"
              positive
              onClick={() => this.launchKS_test()}
            />
            {!this.generatedSplitHasError() && (
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
                        })
                        .then(response => console.log(response.data))
                        .catch(e => {
                          console.error(e)
                          if (e.response !== undefined) {
                            console.error(`Error response: ${e.response}`)
                            toast.error(`${e.response.status} ${e.response.statusText}`)
                          } else {
                            toast.error('Empty response from server')
                          }
                        })
                    })
                    .catch(e => {
                      console.error(e)
                      if (e.response !== undefined) {
                        console.error(`Error response: ${e.response}`)
                        toast.error(`${e.response.status} ${e.response.statusText}`)
                      } else {
                        toast.error('Empty response from server')
                      }
                    })
                }}
              />
            )}
          </Grid.Row>
        )}

      {this.state.breakpoints !== null && (
        <>
          <Grid.Row centered columns={4}>
            <h5>Suggested breakpoints</h5>
          </Grid.Row>
          <Grid.Row centered columns={4}>
            <Grid.Column>
              <ReactDataSheet
                data={this.state.breakpoints}
                valueRenderer={cell => cell.value}
                onCellsChanged={changes => {
                  const grid = this.state.breakpoints.map(row => [...row])
                  changes.forEach(({ cell, row, col, value }) => {
                    grid[row][col] = { ...grid[row][col], value }
                  })
                  this.setState({ breakpoints: grid })
                }}
                rowRenderer={props => (
                  <tr>
                    {props.children}
                    &nbsp;&nbsp;&nbsp;
                    {props.row > 0 && (
                      <Button
                        icon="delete"
                        circular
                        onClick={() => {
                          const grid = this.state.breakpoints.map(row => [...row])
                          grid.splice(props.row, 1)
                          this.setState({ breakpoints: grid })
                        }}
                        size="mini"
                        disabled={props.row === 0 ? true : null}
                      />
                    )}
                  </tr>
                )}
              />
            </Grid.Column>
          </Grid.Row>
        </>
      )}
    </Grid>
  )

  getCustomSplitInput = () =>
    !this.state.auto && (
      <Segment padded>
        <Input
          error={this.customSplitHasError()}
          value={this.state.customSplitValue}
          onChange={e => this.setState({ customSplitValue: e.target.value })}
          label={
            <Dropdown
              options={this.getLevelOptions()}
              onChange={(e, { value }) => {
                this.setState({ customSplitLevel: value })
              }}
              value={this.state.customSplitLevel}
            />
          }
          labelPosition="right"
          placeholder="Enter split value"
        />
      </Segment>
    )

  getSplitLevelDropdown = () =>
    this.state.auto && (
      <Segment padded>
        <h5>Select the level at which breakpoints must be suggested:</h5>
        <Dropdown
          options={this.getLevelOptions()}
          onChange={(e, { value }) => this.setState({ customSplitLevel: value })}
          value={this.state.customSplitLevel}
        />
      </Segment>
    )

  render = () => {
    return (
      !_.isEmpty(this.props.nodeMeta) && (
        <Modal
          size={'large'}
          open={this.props.open}
          onClose={() => {
            this.setState({
              customSplitValue: '',
              auto: false,
              msg: null,
              breakpoints: null,
            })
            this.props.onClose()
          }}
        >
          <Modal.Header>Splitting WT {this.props.nodeMeta.code}</Modal.Header>
          <Modal.Content>
            {this.getAutoSplitToggler()}
            {this.getAutoSplitInputParameters()}
            {this.getCustomSplitInput()}
            {this.getSplitLevelDropdown()}
            {this.getSuggestionSegment()}
            <Dimmer active={this.state.loading}>
              <Loader indeterminate>
                Running Kolmogorov-Smirnov test. Please wait.
              </Loader>
            </Dimmer>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              icon="checkmark"
              content="Split"
              disabled={
                this.state.auto
                  ? this.generatedSplitHasError()
                  : this.state.customSplitValue === '' ||
                    this.state.customSplitLevel === '' ||
                    this.customSplitHasError()
              }
              onClick={() => {
                const [matrix, nSplits] = this.getMatrixAfterSplit()
                this.props.setBreakpoints(this.props.labels, matrix)
                this.setState({
                  customSplitValue: '',
                  auto: false,
                  msg: null,
                  breakpoints: null,
                })
                this.props.onClose()
              }}
            />
          </Modal.Actions>
        </Modal>
      )
    )
  }
}

export default Split
