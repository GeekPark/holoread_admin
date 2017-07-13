import Vuex      from 'vuex'
import Vue       from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    htmlEditor: {},
    markdownEditor: {},
    isLoading: false,
    roles: [{
      label: '游客',
      value: 'visitor'
    },{
      label: '受邀请用户',
      value: 'user'
    },{
      label: '运营',
      value: 'runner'
    },{
      label: '记者',
      value: 'reporter'
    },{
      label: '编辑',
      value: 'editor'
    },{
      label: '管理员',
      value: 'admin'
    }]
  }
})
