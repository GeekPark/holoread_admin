<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
    //- el-button(type='text', @click="$router.push('/users/new')") 添加用户
    //- vsearch(type='User', kw='nickname', :cb='search')
    el-input(placeholder='微信昵称搜索用户' @keyup.enter.native='fetch' v-model='params.nickname')
    el-input(placeholder='手机号搜索用户'  @keyup.enter.native='fetch' v-model='params.phone')
  el-table(:data='listData.data',border)
    el-table-column(type="expand")
      template(scope="props", label-width='150px')
        el-form
          el-form-item(label="ID: ") {{props.row._id || '未填写'}}
          el-form-item(label="Code: ") {{props.row.sms.code || '未填写'}}
          el-form-item(label="微信: ") {{props.row.wechat || '未填写'}}
          el-form-item(label="邮箱: ") {{props.row.email || '未填写'}}
          el-form-item(label="openid: ") {{props.row.openid || '未填写'}}
          el-form-item(label="公司: ") {{props.row.nickname || '未填写'}}
          el-form-item(label="权限: ") {{props.row.permission || '未填写'}}
          el-form-item(label="签名: ") {{props.row.sign || '未填写'}}
          el-form-item(label="职位: ") {{props.row.title || '未填写'}}
          el-form-item(label="创建于: ") {{props.row.created_at || '未填写'}}
          el-form-item(label="更新于: ") {{props.row.updated_at || '未填写'}}
    el-table-column(prop="_id", label='id', width="230")
    el-table-column(prop='nickname', label='nickname')
    el-table-column(prop='头像')
      template(scope='scope')
        img.headimg(:src='scope.row.headimgurl')
    el-table-column(prop='phone', label='phone', width="130")
    el-table-column(prop='permission', label='permission', width="120")

    //- el-table-column(prop='created_at', label='创建时间', width="180")
    el-table-column(label='操作',width='140')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.row)') 编辑
        el-button(size='small',
                  type='danger',
                  @click='handleDestroy(scope.row)') 删除
  el-pagination(@current-change='handleCurrentChange',
                :current-page='params.start',
                :page-size='params.count',
                layout='total, prev, pager, next',
                :total='listData.total')
</template>

<script>
import api from 'stores/api'
// import tools from '../../tools'

const url = 'admin/users'

export default {
  data () {
    return {
      params: {
        nickname: '',
        phone: '',
        count: 20
      },
      listData: {
        data: [],
        total: 0
      },
      loading: false,
      currentPage: 1
    }
  },
  methods: {
    handleEdit (el) {
      this.$router.push(`/users/edit/${el._id}`)
    },
    handleCurrentChange (index) {
      this.currentPage = index
      this.fetch()
    },
    handleDestroy (val) {
      api.put(`${url}/${val._id}`, {state: 'deleted'}).then(result => {
        this.$notify.success('success')
        this.fetch()
      }).catch(err => {
        console.log(err)
        this.$notify.error(err.toString())
      })
    },
    fetch () {
      this.loading = true
      const params = Object.assign({start: this.currentPage - 1}, this.params)
      console.log(params)
      api.get(url, {params: params}).then((result) => {
        this.loading = false
        if (result.data.data === null) {
          this.$notify.error('无数据!!')
          return
        }
        this.listData = result.data
      }).catch(error => {
        console.log(error)
        this.loading = false
        this.$notify.error('请求失败')
      })
    },
    tableRowClassName (row, index) {
      if (row.is_cn) {
        return 'cn-row'
      }
      return ''
    }
  },
  watch: {
    'listData.data': function (val) {
      val = val.forEach(el => {
        // el.created_at = tools.moment(el.createdAt)
      })
    },
    '$route.query': function () {
      // setTimeout(() => { this.fetch() }, 100)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.el-input
  width 300px
  float right
  margin-right 20px
.headimg
  width 40px
</style>
