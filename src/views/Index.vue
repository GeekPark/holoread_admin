<template lang="jade">
#index.admin
  el-row
    el-col(:span='24')
      h1 后台管理中心
  el-row(:gutter="20")
    el-col(v-for='item in sections',
           :key='item.id',
           :span='Math.floor((24 / sections.length / 2))')
      .grid-content.bg-purple
        router-link(:to='item.url').a-title-text.center {{item.title}}
  el-row
    el-col(:span='24')
      h1 快速访问
  el-row(:gutter="20")
    el-col(v-for='item in quickly',
           :key='item.id',
           :span='Math.floor((24 / sections.length / 2))')
      .grid-content.bg-purple
        a(:href='item.url', target='_blank').a-title-text.center {{item.title}}
  el-row
    el-col(:span='24')
      h1 更新说明
      h1 2017-08-24
      h1 source icon
      h1 Command + Enter publish post
</template>

<script>
// import api from '../stores/api'
export default {
  data () {
    return {
      sections: [{
        title: '文章管理',
        url: '/posts'
      }, {
        title: '用户管理',
        url: '/users'
      }],
      quickly: [{
        title: '极客公园',
        url: 'http://geekpark.net'
      }, {
        title: 'Teambition',
        url: 'https://www.teambition.com/projects'
      }, {
        title: '极光推送',
        url: 'https://www.jiguang.cn/dev/#/app/list#dev'
      }, {
        title: 'Github',
        url: 'https://github.com/geekpark/gpk_admin'
      }]
    }
  }
}

</script>

<style lang="stylus" scoped>

.el-col
  margin-bottom 20px

.new-posts

  .grid-content
    min-height 155px
    max-height 155px
    overflow hidden
  h1
    margin-bottom 20px


  p
    line-height 25px
    font-size 1.7rem
</style>
