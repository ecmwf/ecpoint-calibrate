import React from 'react'

import { Modal, Dimmer, Loader } from 'semantic-ui-react'

const PDTViewer = props => (
  <Modal size={'large'} open={props.metadata !== null} onClose={props.onModalClose}>
    <Modal.Header>Point Data Table</Modal.Header>
    <Modal.Content>
      <Dimmer active={props.loading && props.metadata === null}>
        <Loader indeterminate>Loading</Loader>
      </Dimmer>

      {props.metadata !== null && (
        <pre>
          {props.metadata.header}
          <br />
          {props.metadata.footer}
        </pre>
      )}
    </Modal.Content>
  </Modal>
)

export default PDTViewer
