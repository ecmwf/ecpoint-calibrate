import React, { Component } from 'react'

import { remote } from 'electron'
import _ from 'lodash'
import Tree from 'react-d3-tree'
import { saveSvgAsPng } from 'save-svg-as-png'

import { Button, Dimmer, Loader, Radio } from 'semantic-ui-react'
import download from '~/utils/download'
import client from '~/utils/client'
import MappingFunction from './mappingFunction'
import Split from './split'

const mainProcess = remote.require('./server')

export default class TreeContainer extends Component {
  state = {
    openMappingFunction: false,
    openSplit: false,
    histogram: null,
    nodeMeta: null,
    saveInProgress: false,
    treeEditMode: false,
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 14,
      },
    })
  }

  onNodeClickExploreMode = node => {
    !node._children && this.setState({ openMappingFunction: true, nodeMeta: node.meta })
    client.post(
      {
        url: '/postprocessing/generate-wt-histogram',
        body: {
          labels: this.props.labels,
          thrWT: this.props.breakpoints.map(row => _.flatMap(row.slice(1)))[
            node.meta.idxWT
          ],
          path: this.props.path,
          yLim: this.props.yLim,
          bins: this.props.bins,
        },
        json: true,
      },
      (err, httpResponse, body) => this.setState({ histogram: body.histogram })
    )
  }

  onNodeClickEditMode = node => {
    !node._children && this.setState({ openSplit: true, nodeMeta: node.meta })
  }

  onNodeClick = (node, event) => {
    this.state.treeEditMode
      ? this.onNodeClickEditMode(node)
      : this.onNodeClickExploreMode(node)
  }

  handleKeyboardInput = e => {
    const code = e.keyCode ? e.keyCode : e.which

    if (code === 69) {
      //'e' key
      this.setState({ treeEditMode: !this.state.treeEditMode })
    }
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyboardInput.bind(this))
  }

  render = () => {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
        }}
        ref={tc => (this.treeContainer = tc)}
      >
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
                  thrGridOut: this.props.breakpoints,
                  path: this.props.path,
                  yLim: this.props.yLim,
                  destinationDir,
                  bins: this.props.bins,
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

        <p>Press 'e' or click to toggle:</p>
        <Radio
          toggle
          label="Edit mode"
          onChange={() => this.setState({ treeEditMode: !this.state.treeEditMode })}
          checked={this.state.treeEditMode}
        />

        <Tree
          data={this.props.data}
          translate={this.state.translate}
          orientation={'vertical'}
          onClick={(node, event) => this.onNodeClick(node, event)}
          allowForeignObjects
          nodeLabelComponent={{
            render: <NodeLabel />,
          }}
        />

        <MappingFunction
          onClose={() =>
            this.setState({
              openMappingFunction: false,
              histogram: null,
              nodeMeta: null,
            })
          }
          open={this.state.openMappingFunction}
          image={this.state.histogram}
          nodeMeta={this.state.nodeMeta}
        />

        <Split
          onClose={() => this.setState({ openSplit: false })}
          open={this.state.openSplit}
          nodeMeta={this.state.nodeMeta}
          breakpoints={this.props.breakpoints}
          setBreakpoints={this.props.setBreakpoints}
          fields={this.props.fields}
          path={this.props.path}
          labels={this.props.labels}
          yLim={this.props.yLim}
          bins={this.props.bins}
        />
      </div>
    )
  }
}

const NodeLabel = ({ nodeData }) => (
  <div
    style={{ fontSize: '12px', paddingLeft: '15px', width: '200px', fontWeight: 700 }}
  >
    <p>{nodeData.name}</p>
    {nodeData.meta.code && <p>WT {nodeData.meta.code}</p>}
  </div>
)
