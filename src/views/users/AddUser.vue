<template lang="jade">
#add-user.admin
  el-form(:model='form', label-width='100px')
    el-form-item(label='用户级别*')
      el-select(v-model='form.permission', placeholder='请选择权限', size="large" multiple)
        el-option(v-for='item in options', :label='item.label', :value='item.value')
    el-form-item(label='权重', placeholder='必填')
      el-input-number(v-model="form.weight", v-bind:min="0", v-bind:max="100")
    el-form-item(label='昵称*', placeholder='必填')
      el-input(v-model='form.nickname', auto-complete='off')
    el-form-item(label='公司')
      el-input(v-model='form.company')
    el-form-item(label='职位')
      el-input(v-model='form.title')
    el-form-item(label='电话')
      el-input(v-model='form.phone.number')
      el-switch(v-model='form.phone.hidden', on-text='隐藏', off-text='公开')
    el-form-item(label='微信')
      el-input(v-model='form.wechat.number')
      el-switch(v-model='form.wechat.hidden', on-text='隐藏', off-text='公开')
    el-form-item(label='邮箱')
      el-input(v-model='form.email.addr')
      el-switch(v-model='form.email.hidden', on-text='隐藏', off-text='公开')
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
    }
  },
  data () {
    return {
      form: initForm()
    }
  },
  methods: {
    onSubmit () {
      api.post('/admin/users', this.form)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
    },
    onCancel () {
      this.form = initForm()
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
</script>

<style lang="stylus" scoped>
.el-input, .el-textarea
  width 50%
</style>
