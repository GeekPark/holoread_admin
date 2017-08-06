import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Editor: {},
    socket: {},
    isLoading: false,
    wsState: '',
    roles: [{
      label: '游客',
      value: 'visitor'
    }, {
      label: '受邀请用户',
      value: 'user'
    }, {
      label: '运营',
      value: 'runner'
    }, {
      label: '记者',
      value: 'reporter'
    }, {
      label: '编辑',
      value: 'editor'
    }, {
      label: '管理员',
      value: 'admin'
    }],
    articleStates: [{
      value: 'pending',
      label: '待处理'
    }, {
      value: 'normal',
      label: '正常显示'
    }, {
      value: 'recommend',
      label: '编辑推荐'
    }]
  },
  mutations: {
    SET_EDITOR: (state, val) => {
      state.Editor = val
    },
    SET_SOCKET_INFO: (state, val) => {
      state.socket = val
    },
    SET_SOCKET_STATE: (state, val) => {
      state.wsState = val
    }
  }
})
