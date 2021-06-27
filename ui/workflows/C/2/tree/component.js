import React, { Component } from 'react'

import Tree from 'react-d3-tree'
import NodeLabel from './nodeElement'
import { saveSvgAsPng } from 'save-svg-as-png'

import { Button, Dimmer, Dropdown, Form, Grid, Loader, Radio } from 'semantic-ui-react'
import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'
import MappingFunction from './mappingFunction'
import Split from '../split'
import { isMergeableToPreviousRow, mergeToPreviousRow } from '../breakpoints/core'

import _ from 'lodash'

const mainProcess = require('@electron/remote').require('./server')

const MODES_MAP = {
  VISUALIZE_LEAF_MF: 1,
  VISUALIZE_NODE_MF: 2,
  SPLIT_LEAF: 3,
  MERGE_NODE: 4,
  MERGE_LEAF: 5,
}

const CV_MODES_MAP = {
  OBS_FREQUENCY: 'a',
  MEAN: 'b',
  STD_DEV: 'c',
}

export default class TreeContainer extends Component {
  state = {
    openMappingFunction: false,
    openSplit: false,
    graph: null,
    nodeMeta: null,
    loading: false,
    mode: MODES_MAP.VISUALIZE_LEAF_MF,
    conditionalVerificationMode: null,
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

  getMergedMatrix(node) {
    const matrix = this.props.breakpoints
      .map(row => _.flatMap(row.slice(1)))
      .map(inner => inner.slice())

    if (node.children.length === 0) {
      return [matrix, node.meta.idxWT]
    }

    const getRightSubtreeIdx = node =>
      node.children.length === 0
        ? node.meta.idxWT
        : getRightSubtreeIdx(node.children.slice(-1)[0])

    const getLeftSubtreeIdx = node =>
      node.children.length === 0 ? node.meta.idxWT : getLeftSubtreeIdx(node.children[0])

    for (var i = getLeftSubtreeIdx(node); i <= getRightSubtreeIdx(node); i++) {
      var row = matrix[i]
      for (var j = (node.meta.level + 1) * 2; j < row.length; j += 2) {
        matrix[i][j] = '-inf'
        matrix[i][j + 1] = 'inf'
      }
    }

    return [matrix, getRightSubtreeIdx(node)]
  }

  onNodeClickExploreMode = node => {
    this.setState({ openMappingFunction: true, nodeMeta: node.meta })

    const [matrix, from] = this.getMergedMatrix(node)

    client
      .post('/postprocessing/generate-wt-histogram', {
        labels: this.props.labels,
        thrWT: matrix[from],
        path: this.props.path,
        yLim: this.props.yLim,
        bins: this.props.bins,
        cheaper: this.props.cheaper,
      })
      .then(response => {
        this.setState({ graph: response.data.histogram })
      })
      .catch(errorHandler)
  }

  onNodeClickMergeChildrenMode = node => {
    const [matrix, from] = this.getMergedMatrix(node)
    this.props.setBreakpoints(
      this.props.labels,
      _.uniqWith(matrix, _.isEqual),
      this.props.fieldRanges
    )
  }

  onNodeClickMergeLeafNode = node => {
    let [matrix, from] = this.getMergedMatrix(node)

    if (
      !isMergeableToPreviousRow(
        from,
        this.props.breakpoints.map(row => _.flatMap(row.slice(1)))
      )
    ) {
      alert('First node in the group. Merge only to the left.')
      return
    }

    matrix = mergeToPreviousRow(
      from,
      this.props.breakpoints.map(row => _.flatMap(row.slice(1)))
    )
    this.props.setBreakpoints(this.props.labels, matrix, this.props.fieldRanges)
  }

  onNodeClickConditionalVerificationMode = node => {
    this.setState({
      loading: 'Generating conditional verification map. Please wait.',
    })
    client
      .post('/postprocessing/plot-cv-map', {
        labels: this.props.labels,
        thrWT: this.props.breakpoints.map(row => _.flatMap(row.slice(1)))[
          node.meta.idxWT
        ],
        path: this.props.path,
        code: node.meta.code,
        mode: this.state.conditionalVerificationMode,
        cheaper: this.props.cheaper,
      })
      .then(response => {
        this.setState({
          loading: false,
        })

        mainProcess.openPDF(response.data.pdf, `WT_${node.meta.code}`)
      })
      .catch(errorHandler)
  }

  onNodeClickEditMode = node => {
    this.setState({ openSplit: true, nodeMeta: node.meta })
  }

  onNodeClick = (node, toggleNode) => {
    if (node.children.length !== 0 && this.shouldCollapseNode()) {
      toggleNode()
      return
    }

    if (this.state.mode === MODES_MAP.SPLIT_LEAF) {
      this.onNodeClickEditMode(node)
    } else if (this.state.conditionalVerificationMode) {
      this.onNodeClickConditionalVerificationMode(node)
    } else if (this.state.mode === MODES_MAP.VISUALIZE_LEAF_MF) {
      this.onNodeClickExploreMode(node)
    } else if (this.state.mode === MODES_MAP.VISUALIZE_NODE_MF) {
      this.onNodeClickExploreMode(node)
    } else if (this.state.mode === MODES_MAP.MERGE_NODE) {
      this.onNodeClickMergeChildrenMode(node)
    } else if (this.state.mode === MODES_MAP.MERGE_LEAF) {
      this.onNodeClickMergeLeafNode(node)
    }
  }

  shouldCollapseNode = () =>
    ![MODES_MAP.VISUALIZE_LEAF_MF, MODES_MAP.VISUALIZE_NODE_MF].includes(
      this.state.mode
    )

  handleKeyboardInput = e => {
    const code = e.keyCode ? e.keyCode : e.which

    if (code === 69) {
      // 'e' key
      this.setState({
        mode: MODES_MAP.SPLIT_LEAF,
        conditionalVerificationMode: null,
      })
    }

    if (code === 65) {
      // 'a' key
      this.state.conditionalVerificationMode !== CV_MODES_MAP.OBS_FREQUENCY
        ? this.setState({
            mode: MODES_MAP.VISUALIZE_LEAF_MF,
            conditionalVerificationMode: CV_MODES_MAP.OBS_FREQUENCY,
          })
        : this.setState({ conditionalVerificationMode: null })
    }

    if (code === 66) {
      // 'b' key
      this.state.conditionalVerificationMode !== CV_MODES_MAP.MEAN
        ? this.setState({
            mode: MODES_MAP.VISUALIZE_LEAF_MF,
            conditionalVerificationMode: CV_MODES_MAP.MEAN,
          })
        : this.setState({ conditionalVerificationMode: null })
    }

    if (code === 67) {
      // 'c' key
      this.state.conditionalVerificationMode !== CV_MODES_MAP.STD_DEV
        ? this.setState({
            mode: MODES_MAP.VISUALIZE_LEAF_MF,
            conditionalVerificationMode: CV_MODES_MAP.STD_DEV,
          })
        : this.setState({ conditionalVerificationMode: null })
    }
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyboardInput.bind(this))
  }

  getModeDropdown = () => (
    <Dropdown
      placeholder="Select a mode"
      options={[
        { key: 1, text: 'Visualize leaf MF', value: MODES_MAP.VISUALIZE_LEAF_MF },
        { key: 2, text: 'Visualize node MF', value: MODES_MAP.VISUALIZE_NODE_MF },
        { key: 3, text: 'Split leaf', value: MODES_MAP.SPLIT_LEAF },
        { key: 4, text: 'Merge Node', value: MODES_MAP.MERGE_NODE },
        { key: 5, text: 'Merge leaf (no change)', value: MODES_MAP.MERGE_LEAF },
      ]}
      selection
      value={this.state.mode}
      onChange={(e, { value }) =>
        this.setState({
          mode: value,
          conditionalVerificationMode: null,
        })
      }
    />
  )

  render = () => {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
        }}
        ref={tc => (this.treeContainer = tc)}
      >
        <Grid>
          <Grid.Column floated="left" width={5}>
            <Form>
              Mode:&nbsp;&nbsp;
              {this.getModeDropdown()}
              <p>Conditional verification plots:</p>
              <Form.Group>
                <Form.Field>
                  <Radio
                    label="Observation frequency"
                    name="radioGroup"
                    value={CV_MODES_MAP.OBS_FREQUENCY}
                    checked={
                      this.state.conditionalVerificationMode ===
                      CV_MODES_MAP.OBS_FREQUENCY
                    }
                    onChange={() =>
                      this.state.conditionalVerificationMode ===
                      CV_MODES_MAP.OBS_FREQUENCY
                        ? this.setState({ conditionalVerificationMode: null })
                        : !this.shouldCollapseNode()
                        ? this.setState({
                            conditionalVerificationMode: CV_MODES_MAP.OBS_FREQUENCY,
                          })
                        : this.setState({
                            conditionalVerificationMode: CV_MODES_MAP.OBS_FREQUENCY,
                            mode: MODES_MAP.VISUALIZE_LEAF_MF,
                          })
                    }
                    toggle
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Mean"
                    name="radioGroup"
                    value={CV_MODES_MAP.MEAN}
                    checked={
                      this.state.conditionalVerificationMode === CV_MODES_MAP.MEAN
                    }
                    onChange={() =>
                      this.state.conditionalVerificationMode === CV_MODES_MAP.MEAN
                        ? this.setState({ conditionalVerificationMode: null })
                        : !this.shouldCollapseNode()
                        ? this.setState({
                            conditionalVerificationMode: CV_MODES_MAP.MEAN,
                          })
                        : this.setState({
                            conditionalVerificationMode: CV_MODES_MAP.MEAN,
                            mode: MODES_MAP.VISUALIZE_LEAF_MF,
                          })
                    }
                    toggle
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Standard Deviation"
                    name="radioGroup"
                    value={CV_MODES_MAP.STD_DEV}
                    checked={
                      this.state.conditionalVerificationMode === CV_MODES_MAP.STD_DEV
                    }
                    onChange={() =>
                      this.state.conditionalVerificationMode === CV_MODES_MAP.STD_DEV
                        ? this.setState({ conditionalVerificationMode: null })
                        : !this.shouldCollapseNode()
                        ? this.setState({
                            conditionalVerificationMode: CV_MODES_MAP.STD_DEV,
                          })
                        : this.setState({
                            conditionalVerificationMode: CV_MODES_MAP.STD_DEV,
                            mode: MODES_MAP.VISUALIZE_LEAF_MF,
                          })
                    }
                    toggle
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Button
              content="Save tree as PNG"
              icon="download"
              labelPosition="left"
              floated="right"
              size="tiny"
              onClick={() => {
                const node = this.treeContainer.getElementsByTagName('svg')[0]
                saveSvgAsPng(node, 'decision-tree.png', { backgroundColor: '#ffffff' })
              }}
            />
          </Grid.Column>
        </Grid>

        <Tree
          data={this.props.data}
          translate={this.state.translate}
          orientation="vertical"
          allowForeignObjects
          renderCustomNodeElement={nodeProps => (
            <NodeLabel
              {...nodeProps}
              onNodeClick={(node, toggleNode) => this.onNodeClick(node, toggleNode)}
            />
          )}
          collapsible={this.shouldCollapseNode()}
          separation={{ siblings: 2, nonSiblings: 2 }}
        />

        <MappingFunction
          onClose={() =>
            this.setState({
              openMappingFunction: false,
              graph: null,
              nodeMeta: null,
            })
          }
          open={this.state.openMappingFunction}
          image={this.state.graph}
          nodeMeta={this.state.nodeMeta}
        />

        <Split
          onClose={() => this.setState({ openSplit: false })}
          open={this.state.openSplit}
          nodeMeta={this.state.nodeMeta}
          breakpoints={this.props.breakpoints}
          setBreakpoints={this.props.setBreakpoints}
          fieldRanges={this.props.fieldRanges}
          fields={this.props.fields}
          path={this.props.path}
          labels={this.props.labels}
          yLim={this.props.yLim}
          bins={this.props.bins}
          count={this.props.count}
          cheaper={this.props.cheaper}
        />
        <Dimmer active={this.state.loading !== false} inverted>
          <Loader indeterminate>{this.state.loading}</Loader>
        </Dimmer>
      </div>
    )
  }
}
