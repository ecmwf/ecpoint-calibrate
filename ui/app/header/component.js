import React from 'react'

import { Image, Dropdown, Menu, Divider } from 'semantic-ui-react'
import logo from '~/assets/img/ECMWF_logo.png'

const mainProcess = require('@electron/remote').require('./server')
const jetpack = require('fs-jetpack')

const MenuFragment = ({ title, children, divider }) => (
  <>
    <Dropdown.Header>{title}</Dropdown.Header>
    {children}
    {divider && <Divider />}
  </>
)

const Header = props => (
  <Menu borderless inverted style={{ borderRadius: '0', margin: '0' }}>
    <Menu.Item>
      <Image src={logo} size="small" />
    </Menu.Item>

    <Menu.Item>
      <span style={{ color: 'white' }}>
        v{window.require('electron').remote.app.getVersion()}
      </span>
    </Menu.Item>

    <Menu.Menu position="right">
      <Dropdown item text="Menu">
        <Dropdown.Menu>
          {['B', 'C'].includes(props.workflow) && (
            <MenuFragment title="Import">
              {props.workflow === 'C' && (
                <Dropdown.Item
                  disabled={props.page.activePageNumber !== 2}
                  onClick={() => props.onSaveOperationClicked('breakpoints-upload')}
                >
                  Breakpoints CSV
                </Dropdown.Item>
              )}

              {props.workflow === 'B' && (
                <Dropdown.Item
                  disabled={props.page.activePageNumber === 3}
                  onClick={() => {
                    const path = mainProcess.openFile() || null
                    if (path === null) {
                      return
                    }

                    const state = JSON.parse(jetpack.read(path))
                    props.loadWorkflow(state)
                    props.warmupPredictorMetadataCache(state.predictors.path)
                  }}
                >
                  Workflow
                </Dropdown.Item>
              )}
            </MenuFragment>
          )}

          {['B', 'C'].includes(props.workflow) && (
            <MenuFragment title="Export">
              {props.workflow === 'C' && (
                <>
                  <Dropdown.Item
                    disabled={props.page.activePageNumber !== 2}
                    onClick={() => props.onSaveOperationClicked('breakpoints')}
                  >
                    Breakpoints as CSV
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={props.page.activePageNumber !== 2}
                    onClick={() => props.onSaveOperationClicked('mf')}
                  >
                    MFs as CSV
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={props.page.activePageNumber !== 2}
                    onClick={() => props.onSaveOperationClicked('wt')}
                  >
                    WTs as PNG
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={props.page.activePageNumber !== 2}
                    onClick={() => props.onSaveOperationClicked('bias')}
                  >
                    WT biases
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={props.page.activePageNumber !== 2}
                    onClick={() => props.onSaveOperationClicked('all')}
                  >
                    Operation
                  </Dropdown.Item>
                </>
              )}
              {props.workflow === 'B' && (
                <Dropdown.Item
                  disabled={props.page.activePageNumber !== 3}
                  onClick={() => {
                    const path = mainProcess.saveFile('workflow.json') || null
                    if (path === null) {
                      return
                    }

                    jetpack.write(path, props.reduxState)
                  }}
                >
                  Workflow
                </Dropdown.Item>
              )}
            </MenuFragment>
          )}

          <MenuFragment title="Navigation" divider={false}>
            <Dropdown.Item onClick={() => props.resetApp()}>Home</Dropdown.Item>
          </MenuFragment>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  </Menu>
)

export default Header
