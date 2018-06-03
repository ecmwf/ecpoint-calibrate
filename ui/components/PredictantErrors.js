import React, { Component } from 'react'
import { Set } from 'immutable'

import client from '../utils/rpc'

class PredictantErrors extends Component {
  constructor() {
    super()
    this.state = {
      isFEChecked: false,
      isFERChecked: false,
      minValueFER: null,
      minValueFieldClassNames: Set(['mdl-textfield', 'mdl-js-textfield']),
    }
  }

  setMinValueFieldClassNames(action, value) {
    if (action === 'focus') {
      this.setState(state => ({ minValueFieldClassNames: state.minValueFieldClassNames.add('is-focused') }))
    } else if (action === 'blur') {
      this.setState(state => ({ minValueFieldClassNames: state.minValueFieldClassNames.remove('is-focused') }))
    }

    if (action === 'change') {
      if (value) {
        this.setState(state => ({ minValueFER: value, minValueFieldClassNames: state.minValueFieldClassNames.add('is-dirty') }))

        if (!/^\s*$/.test(value) && !isNaN(value)) {
          this.setState(state => ({ minValueFieldClassNames: state.minValueFieldClassNames.remove('is-invalid') }))
        } else {
          this.setState(state => ({ minValueFieldClassNames: state.minValueFieldClassNames.add('is-invalid') }))
        }
      } else {
        this.setState(state => ({ minValueFieldClassNames: state.minValueFieldClassNames.remove('is-dirty').remove('is-invalid') }))
      }
    }
  }

  minValueField() {
    return (
      <div>
        <div className={this.state.minValueFieldClassNames.join(' ')}>
          <input
            className="mdl-textfield__input"
            type="text"
            id="sample2"
            onFocus={() => this.setMinValueFieldClassNames('focus')}
            onBlur={() => this.setMinValueFieldClassNames('blur')}
            onChange={e => this.setMinValueFieldClassNames('change', e.target.value)}
          />
          <label className="mdl-textfield__label" htmlFor="sample2">Number...</label>
          <span className="mdl-textfield__error">Input is not a number!</span>
        </div>
        <p>
           Select a minimum value to consider, so as to not divide by zero.
           Pay attention to the ensure consistency with chosen units.
        </p>
      </div>
    )
  }

  render() {
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer" />
        <div className="mdl-cell mdl-cell--4-col">

          <div className="demo-card-square mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title mdl-card--expand">
              <h2 className="mdl-card__title-text">Predictant Errors</h2>
            </div>
            <div className="mdl-card__supporting-text">
                Select error(s) to compute:

              <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-FE">
                <input
                  type="checkbox"
                  id="checkbox-FE"
                  className="mdl-checkbox__input"
                  checked={this.state.isFEChecked}
                  onChange={() => this.setState({ isFEChecked: !this.state.isFEChecked })}
                />
                <span className="mdl-checkbox__label">Forecast Error (FE)</span>
              </label>

              <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor="checkbox-FER">
                <input
                  type="checkbox"
                  id="checkbox-FER"
                  className="mdl-checkbox__input"
                  checked={this.state.isFERChecked}
                  onChange={() => this.setState({ isFERChecked: !this.state.isFERChecked })}
                />
                <span className="mdl-checkbox__label">Forecast Error Ratio (FER)</span>
              </label>
              {
                this.state.isFERChecked ? this.minValueField() : null
              }
            </div>
          </div>

        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }
}

export default PredictantErrors
