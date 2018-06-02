import React from 'react';

import SelectPredictant from './SelectPredictant';
import PreviewPredictant from './PreviewPredictant';

const Predictant = () => {
  return (
    <div className="mdl-grid">
      <div className="mdl-layout-spacer" />
      <div className="mdl-cell mdl-cell--4-col">
        <SelectPredictant />
      </div>
      <div className="mdl-layout-spacer" />
      <div className="mdl-cell mdl-cell--4-col">
        <PreviewPredictant />
      </div>
      <div className="mdl-layout-spacer" />
    </div>
  );
};

export default Predictant;
