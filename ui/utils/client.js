import zerorpc from 'zerorpc'

const client = new zerorpc.Client()
client.connect('tcp://127.0.0.1:4242')

export default client
