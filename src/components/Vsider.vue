<template lang="jade">
#vsider
  el-row.tac
    el-col(:span='8')
      el-menu.el-menu-vertical-demo(router=true, @open='handleOpen', @close='handleClose', theme="light")
        el-submenu(index='/1')
          template(slot='title')
            | 用户
          el-menu-item(index='/users') 用户列表
          el-menu-item(index='/users/new') 添加用户
        el-submenu(index='/2')
          template(slot='title')
            | 文章
          el-menu-item(index='/posts')  文章列表
          el-menu-item(index='/posts/edit?content_type=markdown') 编辑文章
        el-submenu(index='/3')
          template(slot='title')
            | 日志
          el-menu-item(index='/logs')  日志列表
</template>

<script>

export default {
  name: 'vsider',
  computed: {
  },
  data () {
    return {
      routes: [
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus" scoped>
img
  width calc(100% - 40px)
  margin 20px
#vsider
  texta-align left

  &
    text-align left
</style>

