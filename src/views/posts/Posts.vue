<template lang="jade">
#admin-articles.admin
  .title
    h1 {{$route.meta.title}}
    vsearch(type='Article', kw='edited_title', :cb='search')
  el-table(:data='listData.list', border)
    el-table-column(type="index", width="100")
    el-table-column(prop='edited_title', label='标题')
    el-table-column(prop='order', label=' 状态', width="100")
    el-table-column(prop='created_at', label='创建时间', width="200")
    el-table-column(label='操作', width='250')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  @click='stateVisible = true, currentRow = scope.row') 状态
        el-button(size='small',
                  @click='previewVisible = true, currentRow = scope.row') 预览
        el-button(size='small',
                  type='danger',
                  @click='handleDelete(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='params.start',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
  el-dialog(:title='currentRow.edited_title', v-model='previewVisible', size='tiny')
    p(v-html='currentRow.edited_content')
    span.dialog-footer(slot='footer')
      el-button(@click='previewVisible = false') 取 消
      el-button(type='primary', @click='previewVisible = false') 确 定
  el-dialog(:title='currentRow.edited_title', v-model='stateVisible', size='tiny')
    el-select(v-model='currentRow.order', placeholder='请选择')
      el-option(v-for='item in options', :label='item.label', :value='item.value')
    span.dialog-footer(slot='footer')
      el-button(@click='stateVisible = false') 取 消
      el-button(type='primary', @click='editState') 确 定
</template>

<script>

import Base from '../base'
import api from 'stores/api'
const vm = Base({
  url: 'admin/articles',
  data: {
    previewVisible: false,
    stateVisible: false,
    currentRow: {
    },
    options: [{
      value: -1,
      label: '隐藏'
    }, {
      value: 0,
      label: '正常显示'
    }, {
      value: 1,
      label: '编辑推荐'
    }],
  },
  methods: {
    search (val) {
      this.listData = val
    },
    handleEdit (index, el) {
      this.$router.push(`/posts/edit?id=${el._id}`)
    },
    editState() {
      api.put(`admin/articles/${this.currentRow._id}`, {
        order: this.currentRow.order
      }).then(result => {
        this.$message.success('success')
        this.stateVisible = false
      },error => {
        this.$message.error('error')
        this.stateVisible = false
      })
    }
  }
});
export default vm
</script>

<style lang="stylus">
.el-dialog div
  img, iframe
    width 100%
</style>
