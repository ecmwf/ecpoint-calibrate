import React, { Component } from 'react'
import { Set } from 'immutable'

import client from '../utils/rpc'
import { remote } from 'electron'

const mainProcess = remote.require('./server')

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
          value={this.props.parameters.acc || ''}
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">
          Input is not a valid number!
        </span>
      </div>
      <p>Valid values are: 6, 12, 24</p>
    </div>
  )

  getDateStartField = () => (
    <div className="mdl-card__supporting-text">
      Enter start date to consider in YYYYMMDD format:
      <div className="mdl-textfield mdl-js-textfield">
        <input
          className="mdl-textfield__input"
          type="text"
          pattern="^\d{8}$"
          onChange={e =>
            this.props.onParametersDateStartFieldChange(
              e.target.value,
              e.target.pattern
            )
          }
          value={this.props.parameters.date_start || ''}
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">
          Input is not a valid date! It should in YYYYMMDD format.
        </span>
      </div>
    </div>
  )

  getDateEndField = () => (
    <div className="mdl-card__supporting-text">
      Enter end date to consider in YYYYMMDD format:
      <div className="mdl-textfield mdl-js-textfield">
        <input
          className="mdl-textfield__input"
          type="text"
          pattern="^\d{8}$"
          onChange={e =>
            this.props.onParametersDateEndFieldChange(
              e.target.value,
              e.target.pattern
            )
          }
          value={this.props.parameters.date_end || ''}
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">
          Input is not a valid date! It should in YYYYMMDD format.
        </span>
      </div>
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
          value={this.props.parameters.limSU || ''}
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">Input is not a number!</span>
      </div>
    </div>
  )

  getRangeField = () => (
    <div className="mdl-card__supporting-text">
      Enter a range for the Leadtime (in hours):<br />
      <div className="mdl-textfield mdl-js-textfield">
        <input
          className="mdl-textfield__input"
          type="text"
          pattern="^\d+$"
          onChange={e =>
            this.props.onParametersRangeFieldChange(
              e.target.value,
              e.target.pattern
            )
          }
          value={this.props.parameters.range || ''}
        />
        <label className="mdl-textfield__label">Number...</label>
        <span className="mdl-textfield__error">Input is not a number!</span>
      </div>
    </div>
  )

  getPathOutField = () => (
    <div className="mdl-card__supporting-text">
      Select output filename and directory for storing results:<br />
      <button
        className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
        onClick={() => this.props.onOutPathChange(mainProcess.saveFile())}
      >
        Browse
      </button>
      <span className="text-muted">{this.props.parameters.outPath}</span>
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
            {this.getDateStartField()}
            {this.getDateEndField()}
            {this.getAccField()}
            {this.getLimSUField()}
            {this.getRangeField()}
            {this.getPathOutField()}
          </div>
        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }
}

export default Parameters
