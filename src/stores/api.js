import config from '../config'
import router from '../routers.js'
import store  from './index.js'

const request = axios.create({
  baseURL: `${config.host}/api`,
  timeout: 10000,
  withCredentials: true, // 允许跨域 cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    let json = {}
    try {
      json = JSON.parse(data)
    } catch (e) {
      json = {}
    }
    return json
  }]
});

// Add a request interceptor
request.interceptors.request.use(function (config) {
  config.params = Object.assign({}, config.params)
  if (config.params.start > 0) {config.params.start = config.params.start - 1}
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.data.msg === 'session error') {
    router.push('/login')
  }
  return Promise.reject(error)
})


// get
export default request
