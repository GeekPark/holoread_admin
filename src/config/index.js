const json = require('json-loader!yaml-loader!./config.yaml')
const isDev = process.env.NODE_ENV === 'development'
export default isDev ? json['development'] : json['production']
