<template lang="jade">
#admin-users.admin
  el-table(:data='listData.list',)
    el-table-column(type="index", width="100")
    el-table-column(prop='_id', label='id', width="200")
    el-table-column(prop='title', label='标题'  )
    el-table-column(prop='status', label=' 状态', width="100")
    el-table-column(prop='nickname', label='nickname')
    el-table-column(prop='created_at', label='创建时间', width="200")
    el-table-column(label='操作')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  @click='handlePreview(scope.$index, scope.row)') 预览
        el-button(size='small',
                  type='danger',
                  @click='handleDelete(scope.$index, scope.row)') 删除
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
  url: 'admin/users'
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
