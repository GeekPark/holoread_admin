<template lang="jade">
#index.admin
  el-row.new-posts(:gutter="20")
    el-col(:span='9')
      .grid-content.bg-purple
        h1 最新文章
        //- p.title(v-for='item in postsData', :key='item.id') {{item.trans_title}}
    el-col(:span='5')
      .grid-content.bg-purple-light
        h1 最新活动
    el-col(:span='5')
      .grid-content.bg-purple
        h1 日常数据
    el-col(:span='5')
      .grid-content.bg-purple-light
        h1 日历
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
      }],
      postsData: {
        list: []
      }
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
