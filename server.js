const electron = require('electron')
const path = require('path')

const { app, BrowserWindow, dialog } = electron

/*
 * Electron Window Management
 */

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow()

  mainWindow.maximize()
  mainWindow.loadURL(
    require('url').format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

exports.selectMultiDirectory = () =>
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  }) || []

exports.selectDirectory = () =>
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })

exports.saveFile = () =>
  dialog.showSaveDialog(mainWindow, {
    title: 'Output file path',
    defaultPath: 'test.ascii',
  })

exports.openFile = () =>
  dialog.showOpenDialog(mainWindow, {
    title: 'Input file path',
    properties: ['openFile'],
  })
