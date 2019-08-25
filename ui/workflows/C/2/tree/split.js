import React, { Component } from 'react'

import { Modal, Image, Button, Dimmer, Loader, Input } from 'semantic-ui-react'
import _ from 'lodash'

class Split extends Component {
  state = { customSplitValue: '' }

  split = value => {
    const matrix = this.props.breakpoints.map(row => _.flatMap(row.slice(1)))
    const idx = this.props.nodeMeta.idxWT
    const level = this.props.nodeMeta.level

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

  render = () => {
    return (
      this.props.nodeMeta && (
        <Modal size={'tiny'} open={this.props.open} onClose={this.props.onClose}>
          <Modal.Header>Split WT {this.props.nodeMeta.code}</Modal.Header>
          <Modal.Content>
            <Input
              error={this.splitHasError()}
              value={this.state.customSplitValue}
              onChange={e => this.setState({ customSplitValue: e.target.value })}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              icon="checkmark"
              content="Split"
              disabled={this.state.customSplitValue === '' || this.splitHasError()}
              onClick={() => {
                const matrix = this.split(this.state.customSplitValue)
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
