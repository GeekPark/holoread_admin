import config from '../config'
import router from '../routers.js'
import store  from './index.js'

const axios = require('axios').create({
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
axios.interceptors.request.use(function (config) {
  // config.params = Object.assign({}, config.params)
  // store.commit('LOADING', true)
  config.params = Object.assign({}, config.params)
  if (config.params.page > 0) {config.params.page = config.params.page - 1}
  return config
}, function (error) {
  // store.commit('LOADING', false)
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // store.commit('LOADING', false)
  return response
}, function (error) {
  // store.commit('LOADING', false)
  return Promise.reject(error)
})


// get
export default axios
