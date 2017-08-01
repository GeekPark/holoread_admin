<template lang="jade">
#admin-articles.admin(v-loading.body="loading")
  .title
    el-tabs(v-model='params.language')
      el-tab-pane(label='全部语言', name='')
      el-tab-pane(label='中文', name='cn')
      el-tab-pane(label='英文', name='en')
    el-tabs(v-model='params.state')
      el-tab-pane(label='全部', name='')
      el-tab-pane(label='待处理', name='pending')
      el-tab-pane(label='已处理', name='handled')
      el-tab-pane(label='已推荐', name='recommend')
      el-tab-pane(label='正常显示', name='normal')
      el-tab-pane(label='已删除', name='deleted')

    el-input.search-input(placeholder='请输入标题搜索',
           icon='search',
           v-model='params.title',
           :on-icon-click='fetch',
           @keyup.enter='fetch')

  el-table(:data='listData.list', :row-class-name="tableRowClassName", @cell-click="handleEdit", border)
    el-table-column(prop='edited_title', label='标题')
    el-table-column(label='状态', width="110")
      template(scope='scope')
        span(v-bind:class="{deleted: scope.row.state === 'deleted'}") {{scope.row.state}}
    el-table-column(prop='publishe_at', label='创建时间', width="170")
    el-table-column(label='操作', width='190')
      template(scope='scope')
        el-button(size='small',
                  @click.stop='stateVisible = true, currentRow = scope.row') 状态
        el-button(size='small',
                  @click.stop='previewVisible = true, currentRow = scope.row') 预览
        el-button(size='small',@click.stop="openDestroyBox(scope.$index, scope.row)", type='danger') 删除

  .pagination
    el-select.limits(v-model='params.limit', placeholder='请选择')
      el-option(v-for='item in limits', :label='item', :value='item', :key='item')
    el-button(@click='pre') 上一页
    | &nbsp &nbsp
    el-button(@click='next') 下一页
    h2 共 {{listData.count}} 条

  el-dialog(:title='currentRow.edited_title', v-model='previewVisible', size='tiny')
    p(v-html='previewHtml()')
    span.dialog-footer(slot='footer')
      el-button(@click='previewVisible = false') 取 消
      el-button(type='primary', @click='previewVisible = false') 确 定

  el-dialog(:title='currentRow.edited_title', v-model='stateVisible', size='tiny')
    el-select(v-model='currentRow.state', placeholder='请选择')
      el-option(v-for='item in options', :label='item.label', :value='item.value', :key='item.value')
    span.dialog-footer(slot='footer')
      el-button(@click='stateVisible = false') 取 消
      el-button(type='primary', @click='editState') 确 定
</template>

<script>
import api from 'stores/api'
import tools from '../../tools'

const url = 'admin/articles'

export default {
  data () {
    return {
      params: {
        title: null,
        limit: 40,
        language: '',
        state: ''
      },
      listData: {
        count: 0
      },
      loading: false,
      previewVisible: false,
      stateVisible: false,
      currentRow: {},
      currentPage: 1,
      limits: [20, 40, 100],
      options: this.$store.state.articleStates
    }
  },
  methods: {
    search (val) {
      this.listData = val
    },
    previewHtml () {
      return this.currentRow.edited_content ? this.currentRow.edited_content : this.currentPage.trans_content
    },
    handleEdit (el) {
      window.open(`/posts/edit?id=${el._id}`)
    },
    editState () {
      api.put(`admin/articles/${this.currentRow._id}`, {
        state: this.currentRow.state
      }).then(result => {
        this.$message.success('success')
        this.stateVisible = false
      }, error => {
        this.$message.error(error)
        this.stateVisible = false
      })
    },
    pre () {
      const first = this.listData.list[0].published
      this.$router.push({path: '/posts', query: {last: null, first: first}})
    },
    next () {
      const last = this.listData.list[this.listData.list.length - 1].published
      this.$router.push({path: '/posts', query: {last: last, first: null}})
    },
    handleDestroy (index, val, list) {
      api.put(`${url}/${val._id}`, {state: 'deleted'}).then(result => {
        this.$message.success('success')
        this.fetch()
      }).catch(err => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    fetch () {
      this.loading = true
      const params = Object.assign(this.$route.query, this.params)
      console.log(params)
      api.get(url, {params: params}).then((result) => {
        this.loading = false
        if (result.data.data.list.length <= 0) {
          this.$message.error('无数据!!')
          return
        }
        this.listData = result.data.data
      }).catch(error => {
        this.loading = false
        this.$message.error(error.toString())
      })
    },
    openDestroyBox (index, val) {
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
        })
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
      setTimeout(() => { this.fetch() }, 100)
    },
    'params.state': function () {
      setTimeout(() => { this.fetch() }, 100)
    },
    '$route.query': function () {
      setTimeout(() => { this.fetch() }, 100)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus">
#admin-articles
  .title
    display: flex;
    align-items: center;

  .search-input
    width 200px
    position: absolute;
    right: 50px;
  .el-dialog div
    img, iframe
      width 100%
  .el-table
    font-size 13px
  .limits
    margin-right 10px
    width 70px
  img
    width 100%
  .pagination
    margin-top 10px
  .deleted
    color rgb(255, 102, 96)

  .el-table .cn-row
    background #c9e5f5
  .el-table .positive-row
    background #e2f0e4
  .el-tabs
    display inline-block
    margin-top 13px


</style>
