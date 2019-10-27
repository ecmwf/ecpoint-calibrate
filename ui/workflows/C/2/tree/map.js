import React from 'react'

import { remote } from 'electron'
import { Modal, Image, Button, Dimmer, Loader } from 'semantic-ui-react'

import * as jetpack from 'fs-jetpack'

const mainProcess = remote.require('./server')

const Map = props =>
  props.nodeMeta && (
    <Modal size={'large'} open={props.open} onClose={props.onClose}>
      <Modal.Header>
        Weather Type {props.nodeMeta.code}
        {props.graph !== null && (
          <Button
            content="Save PDF"
            icon="download"
            labelPosition="left"
            floated="right"
            onClick={() => {
              const to = mainProcess.saveFile(`CV_${props.nodeMeta.code}.pdf`) || null
              if (to !== null) {
                jetpack.copy(props.graph.pdf, to)
              }
            }}
          />
        )}
      </Modal.Header>
      <Modal.Content>
        <Dimmer active={props.graph === null}>
          <Loader indeterminate>Loading</Loader>
        </Dimmer>

        {props.graph !== null && (
          <Image src={`data:image/jpeg;base64,${props.graph.preview}`} fluid />
        )}
      </Modal.Content>
    </Modal>
  )

export default Map
