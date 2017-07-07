<template lang="jade">
#vheader
  router-link(to="/")
      img(src="../assets/imgs/copyright.png")
  el-menu.el-menu-demo(theme='light',
                       :default-active='activeIndex',
                       mode='horizontal',
                       @select='handleSelect')
    el-menu-item(index='phone') {{phone}}
    el-menu-item(index='logout') {{state}}

</template>

<script>
import api from '../stores/api'
export default {
  name: 'vheader',
  computed: {
    state () {
      return this.phone === '' ||
             this.phone === null ||
             this.phone === 'null' ? '登录'  :  '退出'
    }
  },
  props: ['phone'],
  data () {
    return {
      activeIndex: "1",
      routes: [
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key === 'logout') {
        api.post('/admin/account/logout').then((result) => {
          if (result.status === 200) {
            localStorage.setItem('user', null);
            localStorage.setItem('login', null);
            this.$router.push('/login');
          }
        })
      } else {
        this.$router.push(`/${key}`)
      }
    }
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

