<template lang="jade">
#add-user.admin(v-loading.body="loading")
  .title
    h1 {{$route.meta.title}}
  el-form(:model='form', label-width='100px')
    img(:src='form.headimgurl')
    el-form-item(label='用户级别*')
      el-select(v-model='form.permission', placeholder='请选择权限', size="large" multiple)
        el-option(v-for='item in options',
                  :label='item.label',
                  :value='item.value',
                  :key="item.value")
    el-form-item(label='nickname', placeholder='必填')
      el-input(v-model='form.nickname', auto-complete='off')
    el-form-item(label='country')
      el-input(v-model='form.country')
    el-form-item(label='city')
      el-input(v-model='form.city')
    el-form-item(label='province')
      el-input(v-model='form.province')
    el-form-item(label='phone')
      el-input(v-model='form.phone')
    el-form-item(label='gender')
      el-input(v-model='form.gender')
    el-form-item(label='state')
      el-input(v-model='form.state')
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
      form: initForm(),
      loading: false
    }
  },
  methods: {
    onSubmit () {
      update(this)
    },
    onCancel () {
      this.$router.push('/users')
    }
  },
  mounted () {
    fetch(this)
  }
}

function initForm () {
  return {
    permission: ['visitor'],
    createdAt: '',
    country: '',
    city: '',
    gender: 1,
    headimgurl: '',
    nickname: '',
    phone: '',
    province: '',
    state: -1
  }
}

function fetch (_this = {}) {
  _this.loading = true
  api.get(`/admin/users/${_this.id}`).then((result) => {
    const user = result.data.data
    Object.keys(_this.form).forEach(key => {
      _this.form[key] = user[key]
    })
    _this.loading = false
  }).catch((err) => {
    _this.$notify.error(err.toString())
    _this.loading = false
  })
}

function update (_this = {}) {
  _this.loading = true
  api.put(`/admin/users/${_this.id}`, _this.form).then((result) => {
    _this.loading = false
    _this.$notify.success('success')
    _this.$router.push('/users')
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
