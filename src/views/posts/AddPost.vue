<template lang="jade">
#add-post.admin
  .title
  el-form(ref='form', :model='form', label-width='80px', label-position='top')
    el-form-item(label='标题', required)
      el-input(placeholder='请输入标题', v-model='form.edited_title')
    el-form-item(label='URL', required)
      el-input(placeholder='请输入链接URL', v-model='form.url')
    el-form-item(label='来源', required)
      el-input(placeholder='请输入来源', v-model='form.source')
    el-form-item(label='语言', required)
      el-radio(class="radio" v-model="form.is_cn" label="true") 中文
      el-radio(class="radio" v-model="form.is_cn" label="false") 英文
    el-form-item(label='摘要', required)
      el-input(type='textarea' placeholder='请输入摘要', v-model='form.summary')
    el-form-item
      veditor#veditor
    el-form-item.actions(label='')
      p 提交后是已发布状态, 请谨慎操作
      p URL 请确保完整, 否则会出错
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click="close") 关闭窗口
</template>

<script>
import api from '../../stores/api'
import qs from 'qs'
export default {
  data: function () {
    return {
      form: {
        edited_title: '',
        edited_content: '',
        summary: '',
        url: '',
        source: '',
        is_cn: 'true'
      }
    }
  },
  methods: {
    onSubmit () {
      createPost(this)
    },
    close () {
      window.close()
    }
  }
}

function getContent (_this) {
  _this.form.edited_content = _this.$store.state.Editor.txt.html()
}

function createPost (_this) {
  getContent(_this)
  if (_this.form.edited_title.trim() === '' ||
      _this.form.edited_content.trim() === '' ||
      _this.form.edited_content.trim() === '<p><br></p>' ||
      _this.form.summary.trim() === '' ||
      _this.form.url.trim() === '' ||
      _this.form.source.trim() === '') {
    _this.$notify.error('请填写完整')
    return false
  }
  api.post(`admin/articles`, qs.stringify(_this.form), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then((result) => {
    _this.$notify.success('success')
    // setTimeout(() => { _this.router.push }, 1000)
  }).catch((err) => {
    console.log(err)
    _this.$notify.error('err')
  })
}
</script>

<style lang="stylus">
#add-post
  padding-left 10px
  padding-right 10px
</style>
