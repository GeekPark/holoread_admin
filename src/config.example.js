const isDev = process.env.NODE_ENV === 'development'

const config = {
  development: {
    host: 'http://127.0.0.1:3000',
    ws:   'ws://127.0.0.1:3001'
  },
  production: {
    host: '',
    ws:   ''
  }
}

export default isDev ? config['development'] : config['production']
