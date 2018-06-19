import React from 'react'

import Predictant from './predictant'
import Header from './header'

const App = () => (
  <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">
    <Header />
    <main className="mdl-layout__content">
      <div className="page-content">
        <Predictant />
      </div>
    </main>
  </div>
)

export default App
