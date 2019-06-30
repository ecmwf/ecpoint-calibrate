import React, { Component } from 'react'
import Tree from 'react-d3-tree'

import { Modal, Image } from 'semantic-ui-react'

const Graph = props => {
  const Hist = <Image src={`data:image/jpeg;base64,${props.image}`} fluid />
  return (
    <Modal size={'large'} open={props.open} onClose={props.onClose}>
      <Modal.Header>Weather Type</Modal.Header>
      <Modal.Content>{Hist}</Modal.Content>
    </Modal>
  )
}

export default class DecisionTree extends Component {
  state = { open: false, histogram: null }

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
          !node._children &&
          this.setState({ open: true, histogram: node.meta.histogram })
        }
      />
      <Graph
        onClose={() => this.setState({ open: false, histogram: null })}
        open={this.state.open}
        image={this.state.histogram}
      />
    </div>
  )
}
