import React from 'react';
import ReactDOM from 'react-dom';

import Root from './config/Root';

const render = (Component) => {
  ReactDOM.render(
    <Component />,
    document.getElementById('root'),
  );
};

render(Root);
