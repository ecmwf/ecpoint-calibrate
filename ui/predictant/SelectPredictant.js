import React, { Component } from 'react'
import { remote } from 'electron'

const mainProcess = remote.require('./server')

class SelectPredictant extends Component {
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
            <div className="mdl-card__actions mdl-card--border">
              <div className="mdl-card__supporting-text">
                Select directory for the predictants you want to use (rainfall,
                temperature, etc.)
              </div>

              <button
                className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                onClick={() =>
                  this.props.onPredictantPathChange(
                    mainProcess.selectDirectory()
                  )
                }
              >
                Browse
              </button>
              <span className="text-muted">
                {this.props.predictant.predictantPath}
              </span>

              {!this.isPathFormatOK() && (
                <p className="text-muted">
                  The specified path does not conform with the required
                  specification:
                  <code>
                    &lt;parent&gt;/vol/ecpoint/ecPoint_DB/FC/&lt;range
                    identifier&gt;/tp
                  </code>
                </p>
              )}
            </div>

            <div className="mdl-card__actions mdl-card--border">
              <div className="mdl-card__supporting-text">
                Select directory for the predictors you want to use (CAPE, SR,
                etc.)
              </div>

              <button
                className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                onClick={() =>
                  this.props.onPredictorsPathChange(
                    mainProcess.selectDirectory()
                  )
                }
              >
                Browse
              </button>
              <span className="text-muted">
                {this.props.predictant.predictorsPath}
              </span>

              {!this.isPathFormatOK() && (
                <p className="text-muted">
                  The specified path does not conform with the required
                  specification:
                  <code>
                    &lt;parent&gt;/vol/ecpoint/ecPoint_DB/FC/&lt;range
                    identifier&gt;/tp
                  </code>
                </p>
              )}

              <div className="mdl-card__supporting-text">
                Select the data type you want to load:
              </div>

              <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect type-selector">
                <input
                  type="radio"
                  className="mdl-radio__button"
                  value="grib"
                  checked={this.props.predictant.type === 'grib'}
                  onChange={e =>
                    this.props.onPredictantTypeChange(e.target.value)
                  }
                />
                <span className="mdl-radio__label">GRIB</span>
              </label>
              <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect type-selector">
                <input
                  type="radio"
                  className="mdl-radio__button"
                  value="netcdf"
                  checked={this.props.predictant.type === 'netcdf'}
                  onChange={e =>
                    this.props.onPredictantTypeChange(e.target.value)
                  }
                />
                <span className="mdl-radio__label">NetCDF</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }
}

export default SelectPredictant
