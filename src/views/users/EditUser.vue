<template lang="jade">
#add-user.admin(v-loading.body="loading")
  .title
    h1 {{$route.meta.title}}
  el-form(:model='form', label-width='100px')
    img(:src='form.headimgurl')
    el-form-item(label='用户级别*')
      el-select(v-model='form.permission', placeholder='请选择权限', size="large", multiple)
        el-option(v-for='item in options',
                  :label='item.label',
                  :value='item.value',
                  :key="item.value")
    el-form-item(label='nickname', placeholder='必填')
      el-input(v-model='form.nickname', auto-complete='off')
    el-form-item(label='phone')
      el-input(v-model='form.phone')
    el-form-item(label='操作')
      el-button(type='primary', @click='onSubmit') 确 定
</template>

<script>
import api from '../../stores/api'
export default {
  computed: {
    options () {
      return this.$store.state.roles
    },
    id () {
      return this.$route.params.id
    }
  },
  data () {
    return {
      form: initForm(),
      loading: false
    }
  },
  methods: {
    onSubmit () {
      update(this)
    },
    onCancel () {
      window.close()
    }
  },
  mounted () {
    fetch(this)
  }
}

function initForm () {
  return {
    permission: ['visitor'],
    headimgurl: '',
    nickname: '',
    phone: ''
  }
}

function fetch (_this = {}) {
  _this.loading = true
  api.get(`/admin/users/${_this.id}`).then((result) => {
    const user = result.data
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = user[key]
    })
    if (_this.form.permission === undefined) {
      _this.form.permission = initForm().permission
    }
    _this.loading = false
  }).catch((err) => {
    _this.$notify.error(err.toString())
    _this.loading = false
  })
}

function update (_this = {}) {
  _this.loading = true
  delete _this.form.headimgurl
  console.log(_this.form)
  api.put(`/admin/users/${_this.id}`, _this.form).then((result) => {
    _this.loading = false
    _this.$notify.success('success')
    _this.$router.push('/users')
    // window.close()
  }).catch((err) => {
    _this.$notify.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%
img
  width 100px
  position absolute
  top 100px
  right 100px
</style>
