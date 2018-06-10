import React, { Component } from 'react'
import { Set } from 'immutable'

import client from '../utils/rpc'

class Parameters extends Component {
  getAccField = () => (
    <div className="mdl-card__supporting-text">
      Enter accumulation (in hours) of the parameter to post-process:
      <div className="mdl-textfield mdl-js-textfield">
        <input
          className="mdl-textfield__input"
          type="text"
          pattern="^(6|12|24)$"
          onChange={e =>
            this.props.onParametersAccFieldChange(
              e.target.value,
              e.target.pattern
            )
          }
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">
          Input is not a valid number!
        </span>
      </div>
      <p>Valid values are: 6, 12, 24</p>
    </div>
  )

  getLimSUField = () => (
    <div className="mdl-card__supporting-text">
      Enter upper limit (in hours) of the window in the forecast with spin-up
      problems:
      <div className="mdl-textfield mdl-js-textfield">
        <input
          className="mdl-textfield__input"
          type="text"
          pattern="^\d+$"
          onChange={e =>
            this.props.onParametersLimSUFieldChange(
              e.target.value,
              e.target.pattern
            )
          }
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">Input is not a number!</span>
      </div>
    </div>
  )

  render() {
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer" />
        <div className="mdl-cell mdl-cell--4-col">
          <div className="demo-card-square mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title mdl-card--expand">
              <h2 className="mdl-card__title-text">Parameters</h2>
            </div>
            {this.getAccField()}
            {this.getLimSUField()}
          </div>
        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }
}

export default Parameters
