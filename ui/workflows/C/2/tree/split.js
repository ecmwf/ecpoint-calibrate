import React, { Component } from 'react'

import {
  Modal,
  Image,
  Button,
  Dimmer,
  Loader,
  Input,
  Dropdown,
  Radio,
  Message,
  Segment,
  Grid,
  Table,
} from 'semantic-ui-react'
import _ from 'lodash'
import client from '~/utils/client'

class Split extends Component {
  state = {
    customSplitValue: '',
    customSplitLevel: '',
    auto: false,
    numSubMem: 100,
    minNumCases: 10,
    numSubSamples: 20,
    msg: null,
    breakpoints: null,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      customSplitLevel:
        !_.isEmpty(props.nodeMeta) && state.customSplitValue === ''
          ? props.nodeMeta.level
          : state.customSplitLevel,
    }
  }

  split = () => {
    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))
    const idx = this.props.nodeMeta.idxWT

    const [value, level] = [this.state.customSplitValue, this.state.customSplitLevel]

    const source = [...matrix[idx]]
    const newWt = [...matrix[idx]]

    newWt[level * 2] = value
    newWt[level * 2 + 1] = source[level * 2 + 1]
    source[level * 2 + 1] = value

    return [..._.slice(matrix, 0, idx), source, newWt, ..._.slice(matrix, idx + 1)]
  }

  splitHasError = () => {
    const value = this.state.customSplitValue
    return value === '' || /^(\d+\.?\d*|\.\d+)$/.test(value) ? null : true
  }

  getLevelOptions = () => {
    const validLevels = _.slice(this.props.fields, this.props.nodeMeta.level)

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
      this.validateSubSamples(
        this.state.numSubMem,
        this.state.numSubSamples,
        this.state.minNumCases
      )
  }

  launchKS_test = () =>
    client.post(
      {
        url: '/postprocessing/get-breakpoints-suggestions',
        body: {
          labels: this.props.labels,
          thrWT: this.props.breakpoints.map(row => _.flatMap(row.slice(1)))[
            this.props.nodeMeta.idxWT
          ],
          path: this.props.path,
          predictor: this.props.nodeMeta.predictor,
          numSubMem: this.state.numSubMem,
          numSubSamples: this.state.numSubSamples,
          minNumCases: this.state.minNumCases,
        },
        json: true,
      },
      (err, httpResponse, body) => {
        this.setState({ breakpoints: body.breakpoints })
      }
    )

  validateSubSamples = (numSubMem, numSubSamples, minNumCases) => {
    if (numSubMem === '' || numSubSamples === '' || minNumCases === '') {
      this.setState({ msg: null })
    } else {
      client.post(
        {
          url: '/postprocessing/validate-num-sub-samples',
          body: {
            path: this.props.path,
            predictor: this.props.nodeMeta.predictor,
            numSubMem,
            numSubSamples,
            minNumCases,
          },
          json: true,
        },
        (err, httpResponse, body) => {
          this.setState({ msg: body })
        }
      )
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
        <h5>No. of sub-members to create per mapping function:</h5>
        <Input
          error={
            this.state.numSubMem === '' || /^\d+$/.test(this.state.numSubMem)
              ? null
              : true
          }
          value={this.state.numSubMem}
          onChange={e => {
            this.setState({ numSubMem: e.target.value })
            this.validateSubSamples(
              e.target.value,
              this.state.numSubSamples,
              this.state.minNumCases
            )
          }}
        />
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
            this.validateSubSamples(
              this.state.numSubMem,
              this.state.numSubSamples,
              e.target.value
            )
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
            this.validateSubSamples(
              this.state.numSubMem,
              e.target.value,
              this.state.minNumCases
            )
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
          </Grid.Row>
        )}

      {this.state.breakpoints !== null && (
        <Grid.Row>
          <Table collapsing celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2" textAlign="center">
                  Suggested Breakpoints
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Index</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Value</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.breakpoints.map((bp, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{idx + 1}</Table.Cell>
                  <Table.Cell>{bp}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Row>
      )}
    </Grid>
  )

  getCustomSplitInput = () =>
    !this.state.auto && (
      <Segment padded>
        <Input
          error={this.splitHasError()}
          value={this.state.customSplitValue}
          onChange={e => this.setState({ customSplitValue: e.target.value })}
          label={
            <Dropdown
              options={this.getLevelOptions()}
              onChange={(e, { value }) => this.setState({ customSplitLevel: value })}
              value={this.state.customSplitLevel}
            />
          }
          labelPosition="right"
          placeholder="Enter split value"
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
            {this.getSuggestionSegment()}
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              icon="checkmark"
              content="Split"
              disabled={
                this.state.customSplitValue === '' ||
                this.state.customSplitLevel === '' ||
                this.splitHasError()
              }
              onClick={() => {
                const matrix = this.split()
                this.props.setBreakpoints(matrix)
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
