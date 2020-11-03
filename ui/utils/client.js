const axios = require('axios')

const HOST = 'localhost'
const PROTOCOL = 'http'
const PORT = '8888'

const client = axios.create({
  baseURL: `${PROTOCOL}://${HOST}:${PORT}`,
  mode: 'no-cors',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  credentials: 'same-origin',
})

export default client
