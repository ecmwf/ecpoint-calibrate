import React from 'react'

import { Image } from 'semantic-ui-react'
import logo from '~/assets/img/ECMWF_logo.png'

const Header = props => (
  <div
    style={{
      paddingLeft: '20px',
      paddingBottom: '10px',
      paddingTop: '20px',
      backgroundColor: '#24252a',
    }}
  >
    <Image src={logo} size="small" verticalAlign="bottom" />
    <span style={{ paddingLeft: '40px', color: 'white', fontSize: '18px' }}>
      ecPoint-Calibrate
    </span>
    <span style={{ paddingLeft: '10px', color: 'white' }}>
      v{window.require('electron').remote.app.getVersion()}
    </span>
  </div>
)

export default Header
