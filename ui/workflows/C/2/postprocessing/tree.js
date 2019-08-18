import React, { Component } from 'react'
import Tree from 'react-d3-tree'

import { remote } from 'electron'

import { Modal, Image, Button, Dimmer, Loader } from 'semantic-ui-react'

import { saveSvgAsPng } from 'save-svg-as-png'

import download from '~/utils/download'

import _ from 'lodash'
import client from '~/utils/client'

const mainProcess = remote.require('./server')

const containerStyles = {
  width: '100%',
  height: '100vh',
}

const Graph = props => {
  const histURI = `data:image/jpeg;base64,${props.image}`
  return (
    <Modal size={'large'} open={props.open} onClose={props.onClose}>
      <Modal.Header>
        Weather Type {props.code}
        {props.image !== null && (
          <Button
            content="Save image"
            icon="download"
            labelPosition="left"
            floated="right"
            onClick={() => {
              download(`WT_${props.code}.png`, histURI)
            }}
          />
        )}
      </Modal.Header>
      <Modal.Content>
        <Dimmer active={props.image === null}>
          <Loader indeterminate>Loading</Loader>
        </Dimmer>

        {props.image !== null && <Image src={histURI} fluid />}
      </Modal.Content>
    </Modal>
  )
}

export default class DecisionTree extends Component {
  state = { open: false, histogram: null, code: null, saveInProgress: false }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 14,
      },
    })
  }

  onNodeClick = node => {
    !node._children && this.setState({ open: true, code: node.meta.code })
    client.post(
      {
        url: '/postprocessing/generate-wt-histogram',
        body: {
          labels: this.props.labels,
          thrWT: this.props.thrGridOut.map(row => _.flatMap(row.slice(1)))[
            node.meta.idxWT
          ],
          path: this.props.path,
          yLim: this.props.yLim,
        },
        json: true,
      },
      (err, httpResponse, body) => this.setState({ histogram: body.histogram })
    )
  }

  render = () => (
    <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
      <Button
        content="Save all WTs as PNG"
        icon="download"
        labelPosition="left"
        floated="right"
        onClick={() => {
          const path = mainProcess.selectDirectory()
          const destinationDir = path && path.length !== 0 ? path.pop() : null

          if (destinationDir === null) {
            return
          }

          this.setState({ saveInProgress: true })
          client.post(
            {
              url: '/postprocessing/save-wt-histograms',
              body: {
                labels: this.props.labels,
                thrGridOut: this.props.thrGridOut,
                path: this.props.path,
                yLim: this.props.yLim,
                destinationDir,
              },
              json: true,
            },
            (err, httpResponse, body) => this.setState({ saveInProgress: false })
          )
        }}
      />

      <Dimmer active={this.state.saveInProgress === true}>
        <Loader indeterminate>
          Saving all Mapping Functions as PNGs. Please wait.
        </Loader>
      </Dimmer>

      <Button
        content="Save decision tree as PNG"
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
        onClick={(node, event) => this.onNodeClick(node)}
        allowForeignObjects
        nodeLabelComponent={{
          render: <NodeLabel />,
        }}
      />

      <Graph
        onClose={() => this.setState({ open: false, histogram: null, code: null })}
        open={this.state.open}
        image={this.state.histogram}
        code={this.state.code}
      />
    </div>
  )
}

const NodeLabel = ({ nodeData }) => (
  <div
    style={{ fontSize: '12px', paddingLeft: '15px', width: '200px', fontWeight: 700 }}
  >
    <p>{nodeData.name}</p>
    {!_.isEmpty(nodeData.meta) && <p>WT {nodeData.meta.code}</p>}
  </div>
)
