import React, { Component } from 'react'

import {
  Modal,
  Image,
  Button,
  Dimmer,
  Loader,
  Input,
  Dropdown,
} from 'semantic-ui-react'
import _ from 'lodash'

class Split extends Component {
  state = {
    customSplitValue: '',
    customSplitLevel: '',
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

  render = () => {
    return (
      !_.isEmpty(this.props.nodeMeta) && (
        <Modal size={'tiny'} open={this.props.open} onClose={this.props.onClose}>
          <Modal.Header>Splitting WT {this.props.nodeMeta.code}</Modal.Header>
          <Modal.Content>
            <Input
              error={this.splitHasError()}
              value={this.state.customSplitValue}
              onChange={e => this.setState({ customSplitValue: e.target.value })}
              label={
                <Dropdown
                  options={this.getLevelOptions()}
                  onChange={(e, { value }) =>
                    this.setState({ customSplitLevel: value })
                  }
                  value={this.state.customSplitLevel}
                />
              }
              labelPosition="right"
              placeholder="Enter split value"
            />
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
                this.setState({ customSplitValue: '' })
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
