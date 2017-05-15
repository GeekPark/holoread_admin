<template lang="jade">
#edit-post.admin
  .title
    h1 {{$route.meta.title}}
  el-form(ref='form', :model='form', label-width='80px')
    el-form-item(label='参考标题')
      .reference
        span.cn.title {{form.origin_title}}
        span.en.title &nbsp {{form.trans_title}}
    el-form-item(label='参考正文')
      .reference
          .cn.content(v-html='form.origin_content')
          .en.content(v-html='form.trans_content') &nbsp
    el-form-item(label='显示标题')
      el-input(placeholder='请输入标题 必填', v-model='form.edited_title')
    el-form-item(label='显示正文')
      veditor#veditor(style="height:400px;max-height:500px;")
    el-form-item(label='Source')
      el-input(placeholder='', v-model='form.source')
    el-form-item(label='URL')
      el-input(placeholder='', v-model='form.url')
    el-form-item(label='')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click="$router.push('/posts')") 关闭
</template>

<script>

import tools    from '../../tools'
import api      from '../../stores/api'

export default {
  data () {
    return {
      form: {
        edited_title:   '',
        origin_title:   'nothing',
        trans_title:    '无标题',
        edited_content: '',
        origin_content: '',
        trans_content:  '',
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    onSubmit() {
      updatePost(this)
      // createPost(this)
    }
  },
  mounted () {
    this.id && getPost(this)
  }
}

function getContent(_this) {
    _this.form.edited_content = _this.$store.state.htmlEditor.$txt.html()
}

function addContent(_this, val) {
  setTimeout(() => {
    _this.$store.state.htmlEditor.$txt.html(_this.form.edited_content)
  },100)
}

function updatePost(_this) {
  getContent(_this)
  api.put(`admin/articles/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function createPost(_this) {
  getContent(_this)
  api.post('admin/articles', _this.form)
  .then((result) => {
     _this.$message.success('success')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function getPost(_this) {
  api.get(`admin/articles/${_this.$route.query.id}`)
  .then((result) => {
    _this.form = result.data.data
    addContent(_this)

  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus">
#edit-post
  .el-input--mini
      width 200px !important

  .el-form-item
    margin-bottom 5px !important


.el-autocomplete-suggestion
  border 1px solid #D7D7D7
  background white !important
  height 250px !important
  overflow-y scroll !important
  li
    padding 10px !important
    list-style none !important

.upload-demo
  width 300px
  border 1px dashed #d9d9d9
  padding 10px
  cursor pointer

.reference
  position relative
  clear both
  width 100%

  .cn, .en
    width calc(50% - 2px)
    word-wrap: break-word;
    word-break: normal;
    display inline
    float left
    border 1px solid #E6E6E6

  .content
    min-height 200px
    max-height 400px
    overflow-y scroll

</style>
