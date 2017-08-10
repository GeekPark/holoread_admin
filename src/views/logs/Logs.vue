<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
    vsearch(type='Log', kw='edited_title', :cb='search')
  el-table(:data='listData.list',)
    el-table-column(type="index", width="100")
    el-table-column(prop='user.nickname', label='nickname')
    el-table-column(prop='event', label='event', width="100")
    el-table-column(prop='type', label='type', width="100")
    el-table-column(prop='created_at', label='创建时间', width="200")
    el-table-column(label='操作')
      template(scope='scope')
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
  url: 'admin/logs',
  methods: {
    search (val) {
      this.listData = val
    }
  }
})
export default vm
</script>

<style lang="stylus" scoped>
</style>
