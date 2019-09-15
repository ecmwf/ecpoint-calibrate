import React from 'react'

import { remote } from 'electron'
import { Modal, Image, Button, Dimmer, Loader } from 'semantic-ui-react'

import * as jetpack from 'fs-jetpack'

const mainProcess = remote.require('./server')

const Map = props => {
  return (
    props.nodeMeta && (
      <Modal size={'fullscreen'} open={props.open} onClose={props.onClose}>
        <Modal.Header>
          Weather Type {props.nodeMeta.code}
          {props.graph !== null && (
            <Button
              content="Save as PDF"
              icon="download"
              labelPosition="left"
              floated="right"
              onClick={() => {
                const to = mainProcess.saveFile(`CV_${props.nodeMeta.code}.pdf`) || null
                if (to !== null) {
                  jetpack.copy(props.graph, to)
                }
              }}
            />
          )}
        </Modal.Header>
        <Modal.Content>
          <Dimmer active={false}>
            <Loader indeterminate>Loading</Loader>
          </Dimmer>

          <canvas id="map-viewer"></canvas>
        </Modal.Content>
      </Modal>
    )
  )
}

export default Map
