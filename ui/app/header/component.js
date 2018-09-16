import React from 'react'

import { Image } from 'semantic-ui-react'

const Header = props => (
  <div style={{ paddingLeft: '20px', paddingBottom: '10px', paddingTop: '20px' }}>
    <Image
      src="https://www.ecmwf.int/sites/default/files/ECMWF_Master_Logo_RGB_nostrap.png"
      size="small"
      verticalAlign="bottom"
    />
    <span style={{ paddingLeft: '20px' }}>
      European Centre for Medium-Range Weather Forecasts
    </span>
  </div>
)

export default Header
