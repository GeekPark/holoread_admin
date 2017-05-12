<template lang="jade">
#add-user.admin
  .title
    h1 {{$route.meta.title}}
  el-form(:model='form', label-width='100px')
    el-form-item(label='用户级别*')
      el-select(v-model='form.permission', placeholder='请选择权限', size="large" multiple)
        el-option(v-for='item in options',
                  :label='item.label',
                  :value='item.value',
                  :key="item.value")
    el-form-item(label='昵称*', placeholder='必填')
      el-input(v-model='form.nickname', auto-complete='off')
    el-form-item(label='公司')
      el-input(v-model='form.company')
    el-form-item(label='职位')
      el-input(v-model='form.title')
    el-form-item(label='电话')
      el-input(v-model='form.phone')
    el-form-item(label='微信')
      el-input(v-model='form.wechat')
    el-form-item(label='邮箱')
      el-input(v-model='form.email', placeholder='登录后台需要')
    el-form-item(label='密码')
      el-input(v-model='form. password', placeholder='登录后台需要')
    el-form-item(label='一句话简介')
      el-input(v-model='form.sign')
    el-form-item(label='简介')
      el-input(v-model='form.intro', type='textarea')
    el-form-item(label='操作')
      el-button(@click='onCancel') 取 消
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
      return this.$route.query.id
    }
  },
  data () {
    return {
      form: initForm()
    }
  },
  methods: {
    onSubmit () {
      if (this.id) {
        update(this)
      } else {
        create(this)
      }
    },
    onCancel () {
      this.form = initForm()
    }
  },
  mounted () {
    if (this.id) { // edit
      fetch(this, {}, `/admin/users/${this.id}`)
    }
  }
}

function initForm () {
  return {
    nickname:   '',
    company:    '',
    title:      '',
    permission: ['visitor'],
    summary:    '',
    sign:       '',
    intro:      '',
    openid:     '',
    password:   '',
    weight:     0,
    wechat:     '',
    email:      '',
    phone:      '',
  }
}

function create (_this) {
  api.post('/admin/users', _this.form)
  .then(result => {
    _this.$message.success('success')
    _this.form = initForm()
  })
  .catch(err => {
    _this.$message.success('error')
  })
}

function fetch (_this = {}, params = {}, url = '') {
  api.get(url, {params: params}).then((result) => {
    _this.form = result.data.data
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}

function update (_this = {}) {
  api.put(`/admin/users/${_this.id}`, _this.form).then((result) => {
    _this.$message.success('success')
    _this.form = initForm()
    _this.$router.push('/users/new')
  }).catch((err) => {
     _this.$message.error(err.toString())
  })
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%
</style>
