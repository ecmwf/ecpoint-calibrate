import React from 'react'

import { Modal, Image, Button, Dimmer, Loader } from 'semantic-ui-react'

import download from '~/utils/download'

const SaveOperation = props => {
  return (
    <Modal size={'large'} open={props.open} onClose={props.onClose}>
      <Modal.Header>Shakalaka</Modal.Header>
      <Modal.Content>Boom boom</Modal.Content>
    </Modal>
  )
}

export default SaveOperation
