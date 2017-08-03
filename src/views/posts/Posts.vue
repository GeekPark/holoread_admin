<template lang="jade">
#admin-articles.admin(v-loading.body="loading")
  .title
    .tabs
      el-tabs(v-model='params.language', @tab-click='handleLanguage')
        el-tab-pane(label='全部语言', name='')
        el-tab-pane(label='中文', name='cn')
        el-tab-pane(label='英文', name='en')
      el-tabs(v-model='params.state', @tab-click='handleState')
        el-tab-pane(label='全部', name='')
        el-tab-pane(label='待处理', name='pending')
        el-tab-pane(label='已处理', name='handled')
        el-tab-pane(label='已推荐', name='recommend')
        el-tab-pane(label='正常显示', name='normal')
        el-tab-pane(label='已删除', name='deleted')
    .search
      el-select.search-options(v-model="params.key",placeholder="请选择")
          el-option(v-for="item in searchOptions", :label="item.label", :value="item.value", :key="item.value")
      el-input.search-input(placeholder='请输入内容搜索',
             icon='search',
             v-model='params.value',
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
        el-button(size='small',@click.stop="handleDestroy(scope.row)", type='danger') 删除

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
        value: '',
        key: '',
        limit: 40,
        language: this.$route.query.language || '',
        state: this.$route.query.state || ''
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
      options: this.$store.state.articleStates,
      searchOptions: [{
        label: '机器翻译标题',
        value: 'trans_title'
      }, {
        label: '已编辑标题',
        value: 'edited_title'
      }, {
        label: '原文标题',
        value: 'origin_title'
      }, {
        label: 'URL',
        value: 'url'
      }, {
        label: '来源',
        value: 'source'
      }]
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
        this.$notify.success('success')
        this.stateVisible = false
      }, error => {
        this.$notify.error(error)
        this.stateVisible = false
      })
    },
    pre () {
      const first = this.listData.list[0].published
      this.$router.push({path: '/posts', query: {last: null, first: first, language: this.params.language, state: this.params.state}})
    },
    next () {
      const last = this.listData.list[this.listData.list.length - 1].published
      this.$router.push({path: '/posts', query: {last: last, first: null, language: this.params.language, state: this.params.state}})
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
    handleState (e) {
      this.$router.push({path: '/posts', query: {language: this.params.language, state: e.name}})
    },
    handleLanguage (e) {
      this.$router.push({path: '/posts', query: {language: e.name, state: this.params.state}})
    },
    fetch () {
      this.loading = true
      const params = Object.assign(this.$route.query, this.params)
      console.log(params)
      api.get(url, {params: params}).then((result) => {
        this.loading = false
        if (result.data.data.list.length <= 0) {
          this.$notify.error('无数据!!')
          return
        }
        this.listData = result.data.data
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
    display flex
    align-items center
    justify-content space-between

  .search-input
    width 200px
  .search-options
    margin-right 20px
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
