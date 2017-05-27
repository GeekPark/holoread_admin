<template lang="jade">
#admin-articles.admin
  .title
    h1 {{$route.meta.title}}
    vsearch(type='Article', kw='edited_title', :cb='search')
  el-table(:data='listData.list', border)
    el-table-column(type="index", width="100")
    el-table-column(prop='edited_title', label='标题')
    el-table-column(prop='status', label=' 状态', width="100")
    el-table-column(prop='created_at', label='创建时间', width="200")
    el-table-column(label='操作', width='200')
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
                :current-page='params.start',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
</template>

<script>

import Base from '../base'
const vm = Base({
  url: 'admin/articles',
  methods: {
    search (val) {
      this.listData = val
    },
    handleEdit (index, el) {
      this.$router.push(`/posts/edit?id=${el._id}`)
    }
  }
});
export default vm
</script>

<style lang="stylus" scoped>
</style>
