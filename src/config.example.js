const isDev = process.env.NODE_ENV === 'development'

const config = {
  development: {
    host: 'http://127.0.0.1:3000'
  },
  production: {
    host: ''
  }
}

export default isDev ? config['development'] : config['production']
