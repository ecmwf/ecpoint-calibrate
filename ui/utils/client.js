const request = require('request')

const client = request.defaults({
  baseUrl: 'http://localhost:8888',
})

export default client
