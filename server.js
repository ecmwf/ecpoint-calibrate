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
      enableRemoteModule: true,
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

// Initialize Docker to communicate with the Docker Engine.
const docker = new Docker({
  socketPath: '/var/run/docker.sock',
})

// containers is an array that tracks the IDs of the containers launched. This
// is particularly useful for stopping the containers on shutdown.
const containers = []

// dockerRuntimePromises is an array of Promise objects that tracks the status
// of spawning various Docker containers required to run the software.
// The Promise object is created before pulling and running the image, and
// resolved only when the container has started running on the host.
//
// Electron app must wait for the promises in this array to be resolved
// successfully before launching the GUI window.
const dockerRuntimePromises = []

const containerFactory = opts => image =>
  new Promise(function(resolve, reject) {
    docker.pull(image, (err, stream) => {
      docker.modem.followProgress(stream, onFinished, onProgress)

      function onFinished(err, output) {
        docker
          .run(image, [], process.stdout, opts, function(err, data, container) {
            if (err) {
              console.error(err.json.message)
              reject()
              process.platform !== 'darwin' ? app.quit() : app.exit(1)
              return
            }

            return container.remove({
              force: true,
            })
          })
          .on('container', function(container) {
            const cid = container.id.substring(0, 12)
            console.log(`Running Docker container: image=${image} containerID=${cid}`)
            containers.push(cid)

            // Wait for 5 seconds before resolving the promise, to be sure that
            // the container is ready to serve requests.
            setTimeout(function() {
              resolve()
            }, 5000)
          })
      }

      function onProgress(event) {
        console.log(event.status)
      }
    })
  })

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

dockerRuntimePromises.push(backendSvc('onyb/ecpoint-calibrate-core:develop'))

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

dockerRuntimePromises.push(loggerSvc('onyb/ecpoint-calibrate-logger'))

app.on('ready', async () => {
  await Promise.all(dockerRuntimePromises)
  createWindow()
})

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
