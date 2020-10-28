const request = require('request')
const axios = require('axios')

const HOST = '0.0.0.0'
const PROTOCOL = 'http'
const PORT = '8888'

// legacy HTTP client based on request.
const client = request.defaults({
  baseUrl: `${PROTOCOL}://${HOST}:${PORT}`,
})

// modern HTTP client based on Axios.
export const httpClient = axios.create({
  baseURL: `${PROTOCOL}://${HOST}:${PORT}`,
})

export default client
