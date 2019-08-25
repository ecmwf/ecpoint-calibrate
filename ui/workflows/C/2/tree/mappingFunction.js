import React from 'react'

import { Modal, Image, Button, Dimmer, Loader } from 'semantic-ui-react'

const MappingFunction = props => {
  const histURI = `data:image/jpeg;base64,${props.image}`
  return (
    props.nodeMeta && (
      <Modal size={'large'} open={props.open} onClose={props.onClose}>
        <Modal.Header>
          Weather Type {props.nodeMeta.code}
          {props.image !== null && (
            <Button
              content="Save image"
              icon="download"
              labelPosition="left"
              floated="right"
              onClick={() => {
                download(`WT_${props.nodeMeta.code}.png`, histURI)
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
  )
}

export default MappingFunction
