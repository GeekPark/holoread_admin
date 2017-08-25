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
    el-form-item.editor-form-item(:label='fullPage ? "": "显示正文"')
      .reference
        .cn.content(v-html='form.origin_content')
        veditor#veditor
    el-form-item(label='机器翻译', required, v-if='!fullPage')
      el-input(placeholder='请输入标题 必填', v-model='form.trans_title', :disabled="true")
    el-form-item(label='机器翻译', required, v-if='!fullPage')
      p.trans_content(v-html='form.trans_content', v-if='!fullPage')
    el-form-item(label='摘要', v-if='!fullPage')
      el-input(type='textarea', placeholder='', v-model='form.summary')
    el-form-item(label='Source', required, v-if='!fullPage')
      el-input(placeholder='', v-model='form.source')
    el-form-item(label='URL', required, v-if='!fullPage')
      el-input(placeholder='', v-model='form.url')
    el-form-item(label='状态', required, v-if='!fullPage')
      el-select(v-model='form.state', placeholder='请选择')
        el-option(v-for='item in options', :label='item.label', :value='item.value', :key='item.value')
    el-form-item(label='', v-if='!fullPage')
      el-button(type='primary', @click='onSubmit') 发布
      el-button(type='danger', @click="close") 关闭窗口
</template>

<script>
import api from '../../stores/api'
import config from '../../config.js'
import qs from 'qs'
export default {
  data () {
    return {
      form: {
        edited_title: '',
        origin_title: 'nothing',
        trans_title: '无标题',
        edited_content: '',
        origin_content: '',
        trans_content: '',
        summary: '',
        url: '',
        source: '',
        state: ''
      },
      options: this.$store.state.articleStates,
      fullPage: false
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    onSubmit () {
      updatePost(this)
    },
    close () {
      window.close()
    }
  },
  mounted () {
    this.id && getPost(this)
    document.onkeydown = (e) => {
      console.log(e.target.tagName.toLowerCase())
      if (['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) > -1) {
        const keyCode = e.keyCode || e.which || e.charCode
        const ctrlKey = e.ctrlKey || e.metaKey
        if (ctrlKey && keyCode === 13) {
          this.form.state = 'normal'
          this.onSubmit()
        }
      }
    }
  },
  watch: {
    'fullPage': function (val) {
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

function getContent (_this) {
  _this.form.edited_content = _this.$store.state.Editor.txt.html()
}

function addContent (_this, val) {
  setTimeout(() => {
    _this.$store.state.Editor.txt.html(_this.form.edited_content)
  }, 300)
}

function updatePost (_this) {
  getContent(_this)
  delete _this.form.origin_title
  delete _this.form.trans_title
  delete _this.form.origin_content
  delete _this.form.trans_content
  api.put(`admin/articles/${_this.$route.query.id}`, qs.stringify(_this.form), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
  .then((result) => {
    _this.$notify.success('success')
    setTimeout(() => { window.close() }, 500)
  }).catch((err) => {
    _this.$notify.error(err)
  })
}

function getPost (_this) {
  api.get(`admin/articles/${_this.$route.query.id}`)
  .then((result) => {
    const data = result.data
    if (data.edited_content === null || data.edited_content === undefined || data.edited_content === '') {
      data.edited_title = data.trans_title
      data.edited_content = data.trans_content
    }
    if (data.summary === '' || data.summary === null || data.summary === undefined) {
      const content = delHtmlTag(data.edited_content)
      data.summary = content.length >= 100 ? content.substring(0, 100) : content
    }
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = data[key]
    })

    addContent(_this)
    ws(_this)
  }).catch((err) => {
    _this.$notify.error(err.toString())
  })
}

function ws (_this) {
  const socket = new WebSocket(`${config.ws}?userid=${localStorage.getItem('userid')}&?nickname=${localStorage.getItem('nickname')}`)
  socket.onopen = function open () {
    console.log('open')
    setInterval(() => {
      _this.$store.commit('SET_SOCKET_STATE', socket.readyState)
    }, 2000)
    socket.send(JSON.stringify({channel: 'lock', article: {edited_title: _this.form.edited_title, _id: _this.id}}))
  }

  socket.onclose = function close () {
    console.log('close')
    // _this.$store.commit('SET_SOCKET_STATE', 3)
  }

  socket.onmessage = function incoming (data) {
    console.log('onmessage')
    console.log(data.data)
    const json = JSON.parse(data.data)
    if (json.channel === 'lockState') {
      _this.$store.commit('SET_SOCKET_INFO', json)
    }
  }
}

function delHtmlTag (str) {
  return str.replace(/<[^>]+>/g, '')
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
.editor-form-item
  height 430px
  .cn
    height 430px

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
