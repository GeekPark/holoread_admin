<template lang="jade">
#edit-post.admin(v-bind:class="{ fullPage: fullPage }")
  .title
    h1(v-if='!fullPage') {{$route.meta.title}}
    h2.full(@click='fullPage = !fullPage') 全屏编辑
  el-form(ref='form', :model='form', label-width='80px')
    el-form-item(:label='fullPage ? "": "参考标题"')
      .reference
        span.cn.title {{form.origin_title}}
        el-input.en.title(placeholder='请输入标题 必填', v-model='form.edited_title')
    el-form-item(:label='fullPage ? "": "正文"')
      .reference
          .cn.content(v-html='form.origin_content')
          veditor#veditor
    el-form-item(label='显示标题', required, v-if='!fullPage')
      el-input(placeholder='请输入标题 必填', v-model='form.edited_title')
    el-form-item(label='机器翻译', required, v-if='!fullPage')
      p.trans_content(v-html='form.trans_content', v-if='!fullPage')
    el-form-item(label='摘要', v-if='!fullPage')
      el-input(type='textarea', placeholder='', v-model='form.summary')
    el-form-item(label='Source', required, v-if='!fullPage')
      el-input(placeholder='', v-model='form.source')
    el-form-item(label='URL', required, v-if='!fullPage')
      el-input(placeholder='', v-model='form.url')
    el-form-item(label='状态', required, v-if='!fullPage')
      el-select(v-model='form.order', placeholder='请选择')
        el-option(v-for='item in options', :label='item.label', :value='item.value')
    el-form-item(label='', v-if='!fullPage')
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
        summary:        '',
        order:          0,
      },
      options: [{
        value: -1,
        label: '隐藏'
      }, {
        value: 0,
        label: '正常显示'
      }, {
        value: 1,
        label: '编辑推荐'
      }],
      fullPage: false
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
  },
  watch: {
    'form': (val) => {
      if (val.summary === '') {
        const content = delHtmlTag(val.edited_content);
        val.summary = content.length >= 100 ? content.substring(0, 100) : content;
      }
    },
    'fullPage': function(val) {
      if (val) {
        document.getElementById('vsider').style.display = 'none'
        document.getElementById('vheader').style.display = 'none'
        return
      }
      document.getElementById('vsider').style.display = 'block'
      document.getElementById('vheader').style.display = 'block'
    }
  }
}



function getContent(_this) {
    _this.form.edited_content = _this.$store.state.Editor.txt.html()
}

function addContent(_this, val) {
  setTimeout(() => {
    _this.$store.state.Editor.txt.html(_this.form.edited_content)
  },100)
}

function updatePost(_this) {
  getContent(_this)
  api.put(`admin/articles/${_this.$route.query.id}`, _this.form)
  .then((result) => {
     _this.$message.success('success')
     _this.$router.push('/posts')
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

function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}
</script>

<style lang="stylus">

.w-e-text-container
  height 370px !important


#edit-post
  padding-left 10px
  padding-right 10px


.full
  cursor pointer
  color #9DC282

.trans_content
  max-height 300px
  position relative
  overflow-y scroll
  border 1px solid #E6E6E6



.reference
  position relative
  clear both
  width 100%

  #veditor
    position absolute
    width 50%
    right 0px

  .cn, .en
    width calc(50% - 22px)
    word-wrap: break-word;
    word-break: normal;
    display inline
    float left
    border 1px solid #E6E6E6
    padding 0 10px

  .en
    border none

  .content
    min-height 200px
    max-height 400px
    overflow-y scroll

.fullPage
  width 100%
  height 100%
  padding 20px
  padding-top 30px
  margin 0
  .full
    position absolute
    top 0px
    left 20px
    background white
    z-index 2

  .el-form-item__content
    margin-left 0px !important
  #veditor
    width 50%
    position absolute
    right 0px
    margin-top 0px !important
    #editor, .w-e-text-container
      height 500px !important
  .content
    min-height 400px
    max-height 550px

</style>
