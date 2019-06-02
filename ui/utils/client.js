const request = require('request')

const HOST = process.env.RUNNING_IN_DOCKER === 'true' ? 'core' : '0.0.0.0'
const PROTOCOL = 'http'
const PORT = '8888'

const client = request.defaults({
  baseUrl: `${PROTOCOL}://${HOST}:${PORT}`,
})

export default client
