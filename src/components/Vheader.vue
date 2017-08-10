<template lang="jade">
#vheader
  router-link(to="/")
      h1 &nbsp &nbsp GEEKPARK
  p.socket {{socketMsg}} {{wsState}}
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
             this.phone === 'null' ? '登录' : '退出'
    },
    socketMsg () {
      const socket = this.$store.state.socket
      const {nickname, type} = socket
      if (type === 'success') {
        return `锁定成功`
      } else if (type === 'failed') {
        setTimeout(() => {
          window.close()
        }, 1500)
        return `锁定失败 ${nickname} 正在编辑`
      } else {
        return ''
      }
    },
    wsState () {
      const state = this.$store.state.wsState
      if (state === 0) {
        return '正在连接'
      } else if (state === 2 || state === 3) {
        return '连接已经关闭'
      } else {
        return ''
      }
    }
  },
  props: ['phone'],
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      if (key === 'logout') {
        api.post('logout').then((result) => {
          if (result.status === 200) {
            localStorage.setItem('phone', null)
            localStorage.setItem('login', null)
            this.$router.push('/login')
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
  position absolute
  right 50px
  top 0px
img
  height 30px
  margin 15px 20px
h1
  color #000
  padding-top 5px
.socket
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  font-size: 20px;
  line-height: 60px;
  margin: 0;

</style>

