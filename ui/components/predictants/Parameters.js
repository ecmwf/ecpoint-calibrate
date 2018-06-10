import React, { Component } from 'react'
import { Set } from 'immutable'

import client from '../../utils/rpc'

class Parameters extends Component {
  state = {
    acc: null,
    accFieldClassNames: Set(['mdl-textfield', 'mdl-js-textfield']),
  }

  setAccFieldClassNames(value) {
    if (value) {
      if (!isNaN(value) && [6, 12, 24].includes(parseInt(value))) {
        this.setState(state => ({
          acc: value,
          accFieldClassNames: state.accFieldClassNames
            .add('is-dirty')
            .remove('is-invalid'),
        }))
      } else {
        this.setState(state => ({
          accFieldClassNames: state.accFieldClassNames
            .add('is-dirty')
            .add('is-invalid'),
        }))
      }
    } else {
      this.setState(state => ({
        acc: null,
        accFieldClassNames: state.accFieldClassNames
          .remove('is-dirty')
          .remove('is-invalid'),
      }))
    }
  }

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
                <div className={this.state.accFieldClassNames.join(' ')}>
                  <input
                    className="mdl-textfield__input"
                    type="text"
                    onFocus={() =>
                      this.setState(state => ({
                        accFieldClassNames: state.accFieldClassNames.add(
                          'is-focused'
                        ),
                      }))
                    }
                    onBlur={() =>
                      this.setState(state => ({
                        accFieldClassNames: state.accFieldClassNames.remove(
                          'is-focused'
                        ),
                      }))
                    }
                    onChange={e => this.setAccFieldClassNames(e.target.value)}
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
