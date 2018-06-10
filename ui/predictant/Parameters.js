import React, { Component } from 'react'
import { Set } from 'immutable'

import client from '../utils/rpc'

class Parameters extends Component {
  render() {
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer" />
        <div className="mdl-cell mdl-cell--4-col">
          <div className="demo-card-square mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title mdl-card--expand">
              <h2 className="mdl-card__title-text">Parameters</h2>
            </div>
            <div className="mdl-card__supporting-text">
              Select accumulation (in hours of the parameter to post-process:
              <div>
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
            </div>
          </div>
        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }
}

export default Parameters
