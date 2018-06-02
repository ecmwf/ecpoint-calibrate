import React from 'react';

const SelectPredictant = () => {
  return (
    <div className="demo-card-square mdl-card mdl-shadow--2dp">
      <div className="mdl-card__title mdl-card--expand">
        <h2 className="mdl-card__title-text">Select Predictant</h2>
      </div>
      <div className="mdl-card__supporting-text">
        Select predictant files.
      </div>
      <div className="mdl-card__actions mdl-card--border">
        <a href="#" className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
          Browse
        </a>
      </div>
    </div>
  );
};

export default SelectPredictant;
