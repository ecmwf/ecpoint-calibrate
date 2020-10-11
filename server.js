const electron = require('electron')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const Docker = require('dockerode')

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
      devTools: true,
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

/*
 * Docker management for launching Core backend.
 */
const image = 'onyb/ecpoint-calibrate-core'
const home = app.getPath('home')
const media = process.platform === 'darwin' ? '/Volumes' : '/media'

console.log('Run Docker image: ' + image)

const docker = new Docker({
  socketPath: '/var/run/docker.sock',
})

let cid

docker
  .run(
    image,
    [],
    process.stdout,
    {
      Volumes: {
        '/home': {},
        '/media': {},
      },
      ExposedPorts: {
        '8888/tcp': {},
      },
      Env: [`HOST_HOME=${home}`, `HOST_MEDIA=${media}`],
      Hostconfig: {
        Binds: [`${home}:/home`, `${media}:/media`],
        PortBindings: {
          '8888/tcp': [
            {
              HostPort: '8888',
            },
          ],
        },
      },
    },
    function(err, data, container) {
      if (err) {
        process.platform !== 'darwin' ? app.quit() : app.exit(1)
        return console.error(err.json.message)
      }

      return container.remove({
        force: true,
      })
    }
  )
  .on('container', function(container) {
    cid = container.id
    console.log('Container: ' + cid)
  })

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  console.log('Stopping container: ' + cid)
  const container = docker.getContainer(cid)
  container.stop({}, () => (process.platform !== 'darwin' ? app.quit() : app.exit(0)))
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

exports.selectDirectory = () => {
  const path = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory'],
  })

  return path && path.length !== 0 ? path.pop() : null
}

exports.saveFile = defaultPath =>
  dialog.showSaveDialogSync(mainWindow, {
    title: 'Output file path',
    defaultPath,
  })

exports.openFile = () => {
  const path = dialog.showOpenDialogSync(mainWindow, {
    title: 'Input file path',
    properties: ['openFile'],
  })

  return path && path.length !== 0 ? path.pop() : null
}
