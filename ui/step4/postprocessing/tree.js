import React, { Component } from 'react'
import Tree from 'react-d3-tree'

import { Modal, Image } from 'semantic-ui-react'

const containerStyles = {
  width: '100%',
  height: '100vh',
}

const Graph = props => (
  <Modal size={'large'} open={props.open} onClose={props.onClose}>
    <Modal.Header>Weather Type</Modal.Header>
    <Modal.Content>
      <Image src={`data:image/jpeg;base64,${props.image}`} fluid />
    </Modal.Content>
  </Modal>
)

export default class DecisionTree extends Component {
  state = { open: false, image: null }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 14,
      },
    })
  }

  render = () => (
    <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
      <Tree
        data={this.props.data}
        translate={this.state.translate}
        orientation={'vertical'}
        onClick={(node, event) =>
          !node._children && this.setState({ open: true, image: node.meta.graph })
        }
      />
      <Graph
        onClose={() => this.setState({ open: false, image: null })}
        {...this.state}
      />
    </div>
  )
}
