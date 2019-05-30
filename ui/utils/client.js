const request = require('request')

const client = request.defaults({
  baseUrl: 'http://0.0.0.0:8888',
})

export default client
