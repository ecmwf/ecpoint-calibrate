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
const home = app.getPath('home')
const media = process.platform === 'darwin' ? '/Volumes' : '/media'

const docker = new Docker({
  socketPath: '/var/run/docker.sock',
})

let containers = []

const containerFactory = opts => image => {
  docker.pull(image, (err, stream) => {
    docker.modem.followProgress(stream, onFinished, onProgress)

    function onFinished(err, output) {
      docker
        .run(image, [], process.stdout, opts, function(err, data, container) {
          if (err) {
            process.platform !== 'darwin' ? app.quit() : app.exit(1)
            return console.error(err.json.message)
          }

          return container.remove({
            force: true,
          })
        })
        .on('container', function(container) {
          const shortCID = container.id.substring(0, 12)
          console.log(
            `Running Docker container: image=${image} containerID=${shortCID}`
          )
          containers.push(shortCID)
        })
    }

    function onProgress(event) {
      console.log(event.status)
    }
  })
}

const backendSvc = containerFactory({
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
})

backendSvc('onyb/ecpoint-calibrate-core:develop')

const loggerSvc = containerFactory({
  ExposedPorts: {
    '9001/tcp': {},
  },
  Hostconfig: {
    PortBindings: {
      '9001/tcp': [
        {
          HostPort: '9001',
        },
      ],
    },
  },
})

loggerSvc('onyb/ecpoint-calibrate-logger')

app.on('ready', createWindow)

app.on('window-all-closed', async () => {
  await Promise.all(
    containers.map(container => {
      console.log('Stopping container: ' + container)
      return docker.getContainer(container).stop({})
    })
  )

  console.log('Exiting...')
  process.platform !== 'darwin' ? app.quit() : app.exit(0)
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
