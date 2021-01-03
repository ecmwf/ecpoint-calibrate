import React, { Component } from 'react'

import { remote } from 'electron'
import _ from 'lodash'

import Tree from 'react-d3-tree'
import { saveSvgAsPng } from 'save-svg-as-png'

import { Button, Dimmer, Loader, Radio, Form, Grid } from 'semantic-ui-react'
import client from '~/utils/client'
import toast from '~/utils/toast'
import MappingFunction from './mappingFunction'
import Split from './split'

const mainProcess = remote.require('./server')

export default class TreeContainer extends Component {
  state = {
    openMappingFunction: false,
    openSplit: false,
    graph: null,
    nodeMeta: null,
    loading: false,
    mode: 'simple',
    conditionalVerificationMode: false,
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
    this.setState({ openMappingFunction: true, nodeMeta: node.meta })
    client
      .post('/postprocessing/generate-wt-histogram', {
        labels: this.props.labels,
        thrWT: this.props.breakpoints.map(row => _.flatMap(row.slice(1)))[
          node.meta.idxWT
        ],
        path: this.props.path,
        yLim: this.props.yLim,
        bins: this.props.bins,
        cheaper: this.props.cheaper,
      })
      .then(response => {
        this.setState({ graph: response.data.histogram })
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

  onNodeClickEditMode = node => {
    this.setState({ openSplit: true, nodeMeta: node.meta })
  }

  onNodeClick = (node, event) => {
    if (!!node._children) {
      return
    }

    if (this.state.mode === 'edit') {
      this.onNodeClickEditMode(node)
    } else if (this.state.conditionalVerificationMode) {
      this.onNodeClickConditionalVerificationMode(node)
    } else if (this.state.mode === 'simple') {
      this.onNodeClickExploreMode(node)
    } else {
      this.onNodeClickExploreMode(node)
    }
  }

  handleKeyboardInput = e => {
    const code = e.keyCode ? e.keyCode : e.which

    if (code === 69) {
      // 'e' key
      this.setState({
        mode: 'edit',
        conditionalVerificationMode: false,
      })
    }

    if (code === 65) {
      // 'a' key
      this.state.conditionalVerificationMode !== 'a'
        ? this.setState({ mode: 'simple', conditionalVerificationMode: 'a' })
        : this.setState({ conditionalVerificationMode: false })
    }

    if (code === 66) {
      // 'b' key
      this.state.conditionalVerificationMode !== 'b'
        ? this.setState({ mode: 'simple', conditionalVerificationMode: 'b' })
        : this.setState({ conditionalVerificationMode: false })
    }

    if (code === 67) {
      // 'c' key
      this.state.conditionalVerificationMode !== 'c'
        ? this.setState({ mode: 'simple', conditionalVerificationMode: 'c' })
        : this.setState({ conditionalVerificationMode: false })
    }
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyboardInput.bind(this))
  }

  getModeRadios = () => (
    <Form.Group>
      <Form.Field>
        <Radio
          label="Simple"
          onChange={() =>
            this.setState({
              mode: 'simple',
              conditionalVerificationMode: false,
            })
          }
          checked={this.state.mode === 'simple'}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label="Edit"
          onChange={() =>
            this.setState({
              mode: 'edit',
              conditionalVerificationMode: false,
            })
          }
          checked={this.state.mode === 'edit'}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label="Non-collapsible"
          onChange={() =>
            this.setState({
              mode: 'non-collapsible',
              conditionalVerificationMode: false,
            })
          }
          checked={this.state.mode === 'non-collapsible'}
        />
      </Form.Field>
    </Form.Group>
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
              <p>Modes:</p>
              {this.getModeRadios()}

              <p>Conditional verification plots:</p>
              <Form.Group>
                <Form.Field>
                  <Radio
                    label="Observation frequency"
                    name="radioGroup"
                    value="a"
                    checked={this.state.conditionalVerificationMode === 'a'}
                    onChange={() =>
                      this.state.conditionalVerificationMode !== 'a'
                        ? this.setState({
                            conditionalVerificationMode: 'a',
                            mode: 'simple',
                          })
                        : this.setState({ conditionalVerificationMode: false })
                    }
                    toggle
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Mean"
                    name="radioGroup"
                    value="b"
                    checked={this.state.conditionalVerificationMode === 'b'}
                    onChange={() =>
                      this.state.conditionalVerificationMode !== 'b'
                        ? this.setState({
                            conditionalVerificationMode: 'b',
                            mode: 'simple',
                          })
                        : this.setState({ conditionalVerificationMode: false })
                    }
                    toggle
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Standard Deviation"
                    name="radioGroup"
                    value="c"
                    checked={this.state.conditionalVerificationMode === 'c'}
                    onChange={() =>
                      this.state.conditionalVerificationMode !== 'c'
                        ? this.setState({
                            conditionalVerificationMode: 'c',
                            mode: 'simple',
                          })
                        : this.setState({ conditionalVerificationMode: false })
                    }
                    toggle
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Button
              content="Save WTs as PNG"
              icon="download"
              labelPosition="left"
              floated="right"
              size="tiny"
              onClick={() => {
                const path = mainProcess.selectDirectory()
                if (path === null) {
                  return
                }

                this.setState({
                  loading: 'Saving all Mapping Functions as PNGs. Please wait.',
                })
                client
                  .post('/postprocessing/save-wt-histograms', {
                    labels: this.props.labels,
                    thrGridOut: this.props.breakpoints,
                    path: this.props.path,
                    yLim: this.props.yLim,
                    destinationDir: path,
                    bins: this.props.bins,
                    cheaper: this.props.cheaper,
                  })
                  .then(() => this.setState({ loading: false }))
                  .catch(e => {
                    console.error(e)
                    if (e.response !== undefined) {
                      console.error(`Error response: ${e.response}`)
                      toast.error(`${e.response.status} ${e.response.statusText}`)
                    } else {
                      toast.error('Empty response from server')
                    }
                  })
                  .then(() => this.setState({ loading: false }))
              }}
            />

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

const NodeLabel = ({ nodeData }) => (
  <div
    style={{ fontSize: '12px', paddingLeft: '15px', width: '200px', fontWeight: 700 }}
  >
    <p>{nodeData.name}</p>
    {nodeData.meta.code && <p>WT {nodeData.meta.code}</p>}
  </div>
)
