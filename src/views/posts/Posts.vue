<template lang="jade">
#admin-articles.admin(v-loading.body="loading")
  .title
    h1 {{$route.meta.title}}
    el-input(placeholder='请输入搜索内容',
           icon='search',
           v-model='params.title',
           :on-icon-click='handleSearch',
           @keyup.enter='handleSearch')
  el-table(:data='listData.list', border)
    el-table-column(prop='edited_title', label='标题')
    el-table-column(prop='order', label='状态', width="50")
    el-table-column(prop='accesses', label='访问', width="50")
    el-table-column(prop='likes', label='收藏', width="50")
    el-table-column(prop='publishe_at', label='创建时间', width="170")
    el-table-column(label='操作', width='240')
      template(scope='scope')
        el-button(size='small',
                  @click='currentRow = scope.row, handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  @click='stateVisible = true, currentRow = scope.row') 状态
        el-button(size='small',
                  @click='previewVisible = true, currentRow = scope.row') 预览
        el-button(size='small',
                  type='danger',
                  @click='handleDestroy(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
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
const options = {
  url: 'admin/articles'
}
export default {
  data() {
    return {
      params: {
        last: null,
        first: null,
        title: null,
        limit: 20,
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
    handleSearch () {
      this.fetch()
    },
    previewHtml () {
      return this.currentRow.edited_content ? this.currentRow.edited_content : this.currentPage.trans_content;
    },
    handleEdit (index, el) {
      api.post(`admin/articles/${this.currentRow._id}/editing`)
      .then(result => {
        this.$router.push(`/posts/edit?id=${el._id}`)
      }).catch(error => {
        if (error.response) {
          this.$message.error(`${error.response.data.data.editing} is editing`);
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
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
      if (index > this.currentPage) {
        const last  = this.listData.list[this.listData.list.length - 1].published
        this.params.last = last
        this.params.first = null
      } else if (index < this.currentPage){
        const first  = this.listData.list[0].published
        this.params.first = first
        this.params.last = null
      }
      this.currentPage = index

      this.fetch()
    },
    handleDestroy(index, val, list) {
      api.delete(`${options.url}/${val._id}`, {}).then((result) => {
        this.$message.success('success')
        this.listData.list.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    fetch() {
      this.loading = true
      api.get(options.url, {params: this.params}).then((result) => {
        this.listData = result.data.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.toString())
      })
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
</style>
