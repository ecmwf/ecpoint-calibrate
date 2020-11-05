const fs = require('fs')
const path = require('path')
const Docker = require('dockerode')

const { app, BrowserWindow, dialog } = require('electron')

/*
 * Electron Window Management.
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

const exit = () => {
  console.log('Exiting...')
  process.platform !== 'darwin' ? app.quit() : app.exit(0)
}

/*
 * Docker management for launching Core backend.
 */

// Volumes management
const pathExists = path => {
  try {
    if (fs.existsSync(path)) {
      return true
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

const home = app.getPath('home')
const media = process.platform === 'darwin' ? '/Volumes' : '/media'
const bindings = [
  pathExists(home) ? `${home}:/home` : null,
  pathExists(media) ? `${media}:/media` : null,
  pathExists('/vol') ? '/vol:/vol' : null,
  pathExists('/tmp') ? '/tmp:/tmp' : null,
  pathExists('/var/tmp') ? '/var/tmp:/var/tmp' : null,
  pathExists('/scratch') ? '/scratch:/scratch' : null,
].filter(e => e !== null)

console.log(`Detected volume bindings: ${bindings}`)

// Docker image names
const backendImage = `onyb/ecpoint-calibrate-core:${app.getVersion()}`
const loggerImage = `onyb/ecpoint-calibrate-logger:${app.getVersion()}`

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

const stopContainers = async containers =>
  await Promise.all(
    containers.map(container => {
      console.log('Stopping container: ' + container)
      return docker.getContainer(container).stop({})
    })
  )

const findAndStopStaleContainers = async () =>
  new Promise(
    async (resolve, reject) =>
      await docker.listContainers(
        {
          filters: {
            ancestor: [backendImage, loggerImage],
          },
        },
        async (err, data) => {
          if (err) {
            if (!!err.json) {
              console.error(err.json.message)
            } else {
              console.error(err)
            }

            reject()
            exit()
          } else {
            await stopContainers(data.map(c => c.Id.substring(0, 12)))
            resolve()
          }
        }
      )
  )

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
              exit()
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
  ExposedPorts: {
    '8888/tcp': {},
  },
  Env: [`HOST_BINDINGS=${bindings.join(',')}`],
  Hostconfig: {
    Binds: bindings,
    PortBindings: {
      '8888/tcp': [
        {
          HostPort: '8888',
        },
      ],
    },
  },
})

const loggerSvc = containerFactory({
  ExposedPorts: {
    '9001/tcp': {},
  },
  Hostconfig: {
    Binds: ['/var/tmp:/var/tmp'],
    PortBindings: {
      '9001/tcp': [
        {
          HostPort: '9001',
        },
      ],
    },
  },
})

app.on('ready', async () => {
  if (!process.env.DEV) {
    // Stop all stale containers left running from a previous ungraceful shutdown.
    await findAndStopStaleContainers()

    // Start background Docker services.
    dockerRuntimePromises.push(backendSvc(backendImage))
    dockerRuntimePromises.push(loggerSvc(loggerImage))

    // Wait for the background Docker services to be ready.
    await Promise.all(dockerRuntimePromises)
  }
  // Launch the GUI window.
  createWindow()
})

app.on('window-all-closed', async () => {
  if (!process.env.DEV) {
    await stopContainers(containers)
  }

  exit()
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
