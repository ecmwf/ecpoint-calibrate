import React from 'react'

import { Image } from 'semantic-ui-react'
import logo from '~/assets/img/ECMWF_logo.png'

const Header = props => (
  <div style={{ paddingLeft: '20px', paddingBottom: '10px', paddingTop: '20px' }}>
    <Image src={logo} size="small" verticalAlign="bottom" />
    <span style={{ paddingLeft: '20px' }}>
      European Centre for Medium-Range Weather Forecasts
    </span>
  </div>
)

export default Header
