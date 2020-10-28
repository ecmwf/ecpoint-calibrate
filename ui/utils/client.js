const axios = require('axios')

const HOST = '0.0.0.0'
const PROTOCOL = 'http'
const PORT = '8888'

const client = axios.create({
  baseURL: `${PROTOCOL}://${HOST}:${PORT}`,
})

export default client
