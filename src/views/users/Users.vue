<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
    //- el-button(type='text', @click="$router.push('/users/new')") 添加用户
    //- vsearch(type='User', kw='nickname', :cb='search')
  el-table(:data='listData.list',border)
    el-table-column(type="expand")
      template(scope="props", label-width='150px')
        el-form
          el-form-item(label="ID: ") {{props.row._id || '未填写'}}
          el-form-item(label="微信: ") {{props.row.wechat || '未填写'}}
          el-form-item(label="邮箱: ") {{props.row.email || '未填写'}}
          el-form-item(label="openid: ") {{props.row.openid || '未填写'}}
          el-form-item(label="公司: ") {{props.row.nickname || '未填写'}}
          el-form-item(label="权限: ") {{props.row.permission || '未填写'}}
          el-form-item(label="签名: ") {{props.row.sign || '未填写'}}
          el-form-item(label="职位: ") {{props.row.title || '未填写'}}
          el-form-item(label="创建于: ") {{props.row.created_at || '未填写'}}
          el-form-item(label="更新于: ") {{props.row.updated_at || '未填写'}}
    el-table-column(type="index", width="100")
    el-table-column(prop='nickname', label='nickname')
    el-table-column(prop='email', label='email', width="150")
    el-table-column(prop='permission', label='permission', width="150")
    el-table-column(prop='created_at', label='创建时间', width="180")
    el-table-column(label='操作',width='180')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  type='danger',
                  @click='handleDestroy(scope.$index, scope.row, listData.list)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='params.start',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
</template>

<script>
import Base from '../base'

const vm = Base({
  url: 'admin/users',
  methods: {
    handleEdit (index, row) {
      this.$router.push(`users/new?id=${row._id}`)
    },
    search (val) {
      this.listData = val
    }
  }
})
export default vm
</script>

<style lang="stylus" scoped>
</style>
