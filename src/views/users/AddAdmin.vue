<template lang="jade">
#add-admin-user.admin
  el-form(:model='form', label-width='100px')
    el-form-item(label='用户级别')
      el-select(v-model='form.permission', placeholder='请选择权限', size="large" multiple)
        el-option(v-for='item in options', :label='item.label', :value='item.value')
    el-form-item(label='用户名')
      el-input(v-model='form.nickname', auto-complete='off', placeholder='必填')
    el-form-item(label='邮箱')
      el-input(v-model='form.email.addr', auto-complete='off', placeholder='必填')
    el-form-item(label='密码')
      el-input(v-model='form.password', placeholder='必填')
    el-form-item(label='操作')
      el-button(@click='dialogFormVisible = false') 取 消
      el-button(type='primary', @click='onSubmit') 确 定
</template>

<script>
export default {
  computed: {
    options () {
      return this.$store.state.roles
    }
  },
  data () {
    return {
      form: {
        nickname:   '',
        company:    '',
        title:      '',
        permission: [],
        summary:    '',
        sign:       '',
        intro:      '',
        _from:      'admin',
        openid:     '0',
        password:   '123456',
        weight:     0,
        wechat:     {
          number: '',
          hidden: false,
        },
        email: {
          addr:   '',
          hidden: false,
        },
        phone: {
          number: '',
          hidden: false,
        },
      }
    }
  },
  methods: {
    onSubmit () {

    }
  }
}
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%
</style>
