const request = require('request')

const client = request.defaults({
  baseUrl: 'http://localhost:5000',
})

export default client
