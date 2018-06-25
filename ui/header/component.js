import React, { Component } from 'react'

const Header = props => (
  <header className="mdl-layout__header">
    <div className="mdl-layout__header-row">
      <span className="mdl-layout-title header-logo">
        <img
          alt=""
          src="https://www.ecmwf.int/sites/all/themes/ecmwf_bootstrap_2017/dist/images/logo.production.png"
        />
      </span>
      <div className="mdl-layout-spacer" />
    </div>
    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
      <a
        href="#fixed-tab-1"
        className={`mdl-layout__tab ${props.page === 0 ? 'is-active' : ''}`}
        onClick={() => props.onPageChange(0)}
      >
        Input Parameters
      </a>
      <a
        href="#fixed-tab-2"
        className={`mdl-layout__tab ${props.page === 1 ? 'is-active' : ''}`}
        onClick={() => props.onPageChange(1)}
      >
        Computations
      </a>
      <a
        href="#fixed-tab-3"
        className={`mdl-layout__tab ${props.page === 2 ? 'is-active' : ''}`}
        onClick={() => props.onPageChange(2)}
      >
        Result
      </a>
    </div>
  </header>
)

export default Header
