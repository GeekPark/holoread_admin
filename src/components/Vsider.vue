<template lang="jade">
#vsider
  el-row.tac
    el-col(:span='8')
      el-menu.el-menu-vertical-demo(router=true, @open='handleOpen', @close='handleClose', theme="light")
        el-menu-item(index='/users')
          template(slot='title')
            i.el-icon-menu
            | 用户列表
        el-menu-item(index='/posts')
          template(slot='title')
            i.el-icon-edit
            | 文章列表
        el-menu-item(index='/posts/add')
          template(slot='title')
            i.el-icon-edit
            | 添加文章
        el-menu-item(index='/translate/check')
          template(slot='title')
            i.el-icon-information
            | 翻译检查
        el-menu-item(index='/translatelog')
          template(slot='title')
            i.el-icon-information
            | 翻译日志
        el-menu-item(index='/accesses')
          template(slot='title')
            i.el-icon-information
            | 访问日志

</template>

<script>
export default {
  name: 'vsider',
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
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

