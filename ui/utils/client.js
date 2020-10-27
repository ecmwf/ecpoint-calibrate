const request = require('request')

const HOST = '0.0.0.0'
const PROTOCOL = 'http'
const PORT = '8888'

const client = request.defaults({
  baseUrl: `${PROTOCOL}://${HOST}:${PORT}`,
})

export default client
