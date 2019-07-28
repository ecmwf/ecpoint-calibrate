import React from 'react'
import _ from 'lodash'

import { Icon, Step } from 'semantic-ui-react'

const MenuFactory = config => props => (
  <Step.Group widths={config.length}>
    {config.map(({ icon, title }, idx) => {
      return (
        <Step
          active={props.page.activePageNumber === idx + 1}
          disabled={_.some(
            _.range(idx).map(
              pageIdx => !_.every(_.values(props.page[props.workflow][pageIdx + 1]))
            )
          )}
          onClick={() => props.onPageChange(idx + 1)}
          key={idx + 1}
        >
          <Icon name={icon} />
          <Step.Content>
            <Step.Title>{title}</Step.Title>
          </Step.Content>
        </Step>
      )
    })}
  </Step.Group>
)

export default MenuFactory
