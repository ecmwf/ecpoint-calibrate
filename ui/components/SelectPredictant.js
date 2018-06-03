import React, { Component } from 'react'
import { remote } from 'electron'

const mainProcess = remote.require('./server')

class SelectPredictant extends Component {
  constructor() {
    super()
    this.state = {
      path: null,
    }
  }

  isPathFormatOK() {
    return true
  }

  render() {
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer" />
        <div className="mdl-cell mdl-cell--4-col">

          <div className="demo-card-square mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title mdl-card--expand">
              <h2 className="mdl-card__title-text">Select Predictant</h2>
            </div>
            <div className="mdl-card__supporting-text">
        Select directory for the predictants you want to use (rainfall, temperature, etc.)
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <button
                className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                onClick={() => this.setState({ path: mainProcess.selectDirectory() })}
              >
          Browse
              </button><span className="text-muted">{this.state.path}</span>

              {!this.isPathFormatOK() && <p className="text-muted">
          The specified path does not conform with the required specification:
                <code>&lt;parent&gt;/vol/ecpoint/ecPoint_DB/FC/&lt;range identifier&gt;/tp</code>
              </p>
          }
            </div>
          </div>
        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }
}

export default SelectPredictant
