const electron = require('electron')
const path = require('path')

const { app, BrowserWindow, dialog } = electron

/*
 * Electron Window Management
 */

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
    },
  })

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

/* handle crashes and kill events */
process.on('uncaughtException', function(err) {
  // log the message and stack trace
  fs.writeFileSync('crash.log', err + '\n' + err.stack)

  // relaunch the app
  app.relaunch({ args: [] })
  app.exit(0)
})

process.on('SIGTERM', function() {
  fs.writeFileSync('shutdown.log', 'Received SIGTERM signal')

  // relaunch the app
  app.relaunch({ args: [] })
  app.exit(0)
})

exports.selectMultiDirectory = () =>
  dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  }) || []

exports.selectDirectory = () =>
  dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory'],
  })

exports.saveFile = defaultPath =>
  dialog.showSaveDialogSync(mainWindow, {
    title: 'Output file path',
    defaultPath,
  })

exports.openFile = () =>
  dialog.showOpenDialogSync(mainWindow, {
    title: 'Input file path',
    properties: ['openFile'],
  })
