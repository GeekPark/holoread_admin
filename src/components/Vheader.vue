<template lang="jade">
#vheader
  router-link(to="/")
      img(src="../assets/imgs/copyright.png")
  el-menu.el-menu-demo(theme='light',
                       :default-active='activeIndex',
                       mode='horizontal',
                       @select='handleSelect')
    el-menu-item(index='email') {{email}}
    el-submenu(index='profile')
      template(slot='title') 个人中心
      el-menu-item(index='profile') 账号
      el-menu-item(index='logout') 登出
</template>

<script>
import api from '../stores/api'
export default {
  name: 'vheader',
  computed: {
  },
  data () {
    return {
      activeIndex: "1",
      email: '',
      routes: [
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key === 'logout') {
        api.post('/admin/account/logout').then((result) => {
          if (result.status === 200) {
            localStorage.setItem('email', null);
            localStorage.setItem('user', null);
            this.$router.push('/login');
          }
        })
      } else {
        this.$router.push(`/${key}`)
      }
    }
  },
  beforeMount () {
    let email = localStorage.getItem('email');
    this.$set(this, 'email', email);
  }
}
</script>

<style lang="stylus" scoped>
.el-menu
  float right
  margin-right 45px
img
  height 30px
  margin 15px 20px
</style>

