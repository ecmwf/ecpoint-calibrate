import React, { Component } from 'react'
import Tree from 'react-d3-tree'

import { Modal, Image, Button } from 'semantic-ui-react'

import { saveSvgAsPng } from 'save-svg-as-png'

import download from '~/utils/download'

const containerStyles = {
  width: '100%',
  height: '100vh',
}

const Graph = props => {
  const histURI = `data:image/jpeg;base64,${props.image}`
  const Hist = <Image src={histURI} fluid />

  return (
    <Modal size={'large'} open={props.open} onClose={props.onClose}>
      <Modal.Header>
        Weather Type
        <Button
          content="Save image"
          icon="download"
          labelPosition="left"
          floated="right"
          onClick={() => {
            download('WT.png', histURI) // [TODO] - Add WT code in the filename
          }}
        />
      </Modal.Header>
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
      <Button
        content="Save as image"
        icon="download"
        labelPosition="left"
        floated="right"
        onClick={() => {
          const node = this.treeContainer.getElementsByTagName('svg')[0]

          saveSvgAsPng(node, 'decision-tree.png', { backgroundColor: '#ffffff' })
        }}
      />
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
