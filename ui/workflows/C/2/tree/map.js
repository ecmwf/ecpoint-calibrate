import React from 'react'

import { Modal, Image, Button, Dimmer, Loader } from 'semantic-ui-react'

const Map = props => {
  return (
    props.nodeMeta && (
      <Modal size={'fullscreen'} open={props.open} onClose={props.onClose}>
        <Modal.Header>Weather Type {props.nodeMeta.code}</Modal.Header>
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
