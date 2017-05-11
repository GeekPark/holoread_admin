<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
    el-button(type='text', @click="$router.push('/users/new')") 添加用户
  el-table(:data='listData.list',)
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
          //- wechat:""
          //- _id:"59113b5cd2c0b878b6caef1f"
          //- email:""
          //- createdAt:"2017-05-09T03:45:32.180Z"
          //- company:""
          //- phone:""
          //- created_at:"2017-05-09 11:45:32"
          //- nickname:"ewww4442"
          //- openid:""
          //- password:""
          //- permission:Array[1]
          //- sign:""
          //- state:-1
          //- title:""
          //- updatedAt:"2017-05-11T05:42:22.446Z"
          //- updated_at:"2017-05-11 13:42:22"
    el-table-column(type="index", width="100")
    el-table-column(prop='nickname', label='nickname')
    el-table-column(prop='status', label=' 状态', width="100")
    el-table-column(prop='created_at', label='创建时间', width="200")
    el-table-column(label='操作')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  type='danger',
                  @click='handleDestroy(scope.$index, scope.row, listData.list)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
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
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>
.el-table, .el-pagination
  margin-top 20px
.el-input
  width 40%
.add-btn
  margin-left 30px
.el-table
  margin-top 30px
</style>
