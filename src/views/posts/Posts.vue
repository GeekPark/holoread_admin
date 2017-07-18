<template lang="jade">
#admin-articles.admin(v-loading.body="loading")
  .title
    h1 {{$route.meta.title}}
    el-radio-group(v-model='params.language')
      el-radio(label='') 全部
      el-radio(label='en') 英文
      el-radio(label='cn') 中文
    el-input(placeholder='请输入标题搜索',
           icon='search',
           v-model='params.title',
           :on-icon-click='fetch',
           @keyup.enter='fetch')


  el-table(:data='listData.list', :row-class-name="tableRowClassName", @cell-click="handleEdit", border)
    el-table-column(prop='edited_title', label='标题')
    el-table-column(prop='order', label='状态', width="50")
    el-table-column(prop='accesses', label='访问', width="50")
    el-table-column(prop='likes', label='收藏', width="50")
    el-table-column(prop='publishe_at', label='创建时间', width="170")
    el-table-column(label='操作', width='190')
      template(scope='scope')
        //- el-button(size='small',
        //-           @click='currentRow = scope.row, handleEdit(scope.row)') 编辑
        el-button(size='small',
                  @click='stateVisible = true, currentRow = scope.row') 状态
        el-button(size='small',
                  @click='previewVisible = true, currentRow = scope.row') 预览
        el-button(size='small',@click="openDestroyBox(scope.$index, scope.row)", type='danger') 删除

  .pagination
    el-select.limits(v-model='params.limit', placeholder='请选择')
      el-option(v-for='item in limits', :label='item', :value='item')
    el-button(@click='pre') 上一页
    el-button(@click='next') 下一页
    h2 共 {{listData.meta.total_count}} 条

  el-dialog(:title='currentRow.edited_title', v-model='previewVisible', size='tiny')
    p(v-html='previewHtml()')
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

import api from 'stores/api'
import tools from '../../tools'

const url = 'admin/articles'

export default {
  data() {
    return {
      params: {
        last: null,
        first: null,
        title: null,
        limit: 20,
        language: '',
      },
      listData: {
        meta: {
          total_count: 0,
          limit_value: 0
        }
      },
      loading: false,
      previewVisible: false,
      stateVisible: false,
      currentRow: {},
      currentPage: 1,
      limits: [20, 50, 100],
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
    }
  },
  methods: {
    search (val) {
      this.listData = val
    },
    previewHtml () {
      return this.currentRow.edited_content ? this.currentRow.edited_content : this.currentPage.trans_content;
    },
    handleEdit (el) {
      api.post(`admin/articles/${el._id}/editing`)
      .then(result => {
        window.open(`/posts/edit?id=${el._id}`)
      }).catch(error => {
        if (error.response) {
          this.$message.error(`${error.response.data.data.editing.nickname} 正在编辑!!! 已经锁定`);
        }
      })
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
    },
    pre() {
      const first  = this.listData.list[0].published
      this.params.first = first
      this.params.last = null
      this.fetch()
    },
    next() {
      const last  = this.listData.list[this.listData.list.length - 1].published
      this.params.last = last
      this.params.first = null
      this.fetch()
    },
    handleDestroy(index, val, list) {
      api.delete(`${url}/${val._id}`, {}).then((result) => {
        this.$message.success('success')
        console.log(index)
        this.fetch()
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    fetch() {
      this.loading = true
      api.get(url, {params: this.params}).then((result) => {
        this.loading = false
        if (result.data.data.list.length <= 0) {
          this.$message.error('没有数据啦!!')
          return;
        }
        this.listData = result.data.data
      }).catch(error => {
        this.loading = false
        this.$message.error(error.toString())
      })
    },
    openDestroyBox(index, val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDestroy(index, val)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    tableRowClassName(row, index) {
      if (row.is_cn) {
        return 'cn-row';
      }
      return '';
    }
  },
  watch: {
    'listData.list': function (val) {
      val = val.forEach(el => {
        if (!el.edited_title) {
          el.edited_title = el.trans_title
        }
        if (!el.edited_content) {
          el.edited_content = el.trans_content
        }
        el.publishe_at = tools.moment(el.published)
        el.accesses = el.accesses ? el.accesses.length : '无数据'
        el.likes = el.likes ? el.likes.length : '无数据'
      })
    },
    'params.language': function () {
      setTimeout(() => {this.fetch()}, 100)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus">
#admin-articles
  .el-input
    width 200px
    float right
  .el-dialog div
    img, iframe
      width 100%
  .el-table
    font-size 13px
  .limits
    top 12px
    margin-right 10px

  img
    width 100%

  .el-table .cn-row {
    background: #c9e5f5;
  }

  .el-table .positive-row {
    background: #e2f0e4;
  }


</style>
