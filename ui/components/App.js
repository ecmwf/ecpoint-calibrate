import React from 'react';

import Predictant from './Predictant';
import Header from './Header';

const App = () => {
  return (
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header />
      <main className="mdl-layout__content">
        <div className="page-content"><Predictant /></div>
      </main>
    </div>
  );
};

export default App;
