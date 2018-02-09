<template lang="jade">
#admin-articles.admin(v-loading.body="loading")
  .title
    .tabs
      el-tabs(v-model='params.language', @tab-click='preFetch')
        el-tab-pane(label='全部语言', name='all')
        el-tab-pane(label='中文', name='cn')
        el-tab-pane(label='英文', name='en')
      el-tabs(v-model='params.state', @tab-click='preFetch')
        el-tab-pane(label='全部', name='all')
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
             :on-icon-click='preFetch',
             @keyup.enter.native='preFetch')
  .timerange
    el-date-picker(v-model='params.timerange', type='datetimerange', :picker-options='pickerOptions', placeholder='选择时间范围', align='right', @change='preFetch')
    el-button(@click='clearOptions').clear 重置
    el-radio(class="radio", v-model="is_cn_display", label="0") 英文显示
    el-radio(class="radio", v-model="is_cn_display", label="1") 中文显示
    el-radio(class="radio", v-model="params.sortby", label="published") 发布时间
    el-radio(class="radio", v-model="params.sortby", label="createdAt") 爬取时间

  el-table(:data='listData.data', :row-class-name="tableRowClassName", @selection-change="handleSelectionChange", border)
    el-table-column(type="selection", width="55")
    el-table-column(prop='edited_title', label='标题')
      template(scope='scope')
        div(@click='handleEdit(scope.row)') {{is_cn_display === "1" ? scope.row.edited_title : scope.row.origin_title}}
    el-table-column(label='来源', width="90")
      template(scope='scope')
        img.source(:src='qiniuUrl(scope.row.source)',
                   :alt='scope.row.source',
                   @click.stop="params.key='source'; params.value=scope.row.source; preFetch()")
    el-table-column(label='状态', width="70")
      template(scope='scope')
        span(v-bind:class="{deleted: scope.row.state === 'deleted'}") {{scope.row.state}}
    el-table-column(label='锁定', width="70")
      template(scope='scope')
        span(v-if='scope.row.lock') 🔓
    el-table-column(label='时间', width="180")
      template(scope='scope')
        span {{params.sortby === "published" ? tools.utc(scope.row.published) : tools.utc(scope.row.createdAt)}}
    el-table-column(label='操作', width='190')
      template(scope='scope')
        el-button(size='small',
                  @click.stop='stateVisible = true, currentRow = scope.row') 状态
        el-button(size='small',
                  type='info',
                  @click.stop="handlePreview(scope.row)") 预览
        el-button(size='small',@click.stop="handleDestroy(scope.row)", type='danger') 删除
  .actions
    el-button(@click.stop="handleDestroyList", type='danger', v-if='multipleSelection.length') 删除所选
  .pagination
    el-pagination(@current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='params.count',
                layout='total, prev, pager, next',
                :total='listData.total')
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
import config from '../../config'

const url = 'admin/articles'
const defaultData = {
  value: '',
  key: 'trans_title',
  language: 'all',
  state: 'all',
  count: 20,
  sortby: 'published',
  timerange: []
}

export default {
  data () {
    return {
      tools: tools,
      params: defaultData,
      listData: {
        data: [],
        total: 0
      },
      is_cn_display: '0',
      currentPage: 1,
      multipleSelection: [],
      locked: [],
      loading: false,
      currentRow: {},
      stateVisible: false,
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
      }],
      pickerOptions: {
        shortcuts: [{
          text: '昨天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    qiniuUrl (name) {
      return `http://osxjx70im.bkt.clouddn.com/app/icon/${name}.png`
    },
    handleEdit (el) {
      window.open(`/posts/edit?id=${el._id}`)
    },
    handleCurrentChange (index) {
      this.currentPage = index
      this.fetch()
    },
    clearOptions () {
      this.currentPage = 1
      this.params.value = ''
      this.fetch()
    },
    editState () {
      if (this.currentRow.state === '🚀') {
        this.currentRow.state = 'recommend'
      } else if (this.currentRow.state === '🔖') {
        this.currentRow.state = 'normal'
      } else if (this.currentRow.state === '🚧') {
        this.currentRow.state = 'pending'
      } else if (this.currentRow.state === '❌') {
        this.currentRow.state = 'deleted'
      }
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
    handlePreview (val) {
      window.open(`https://holoread.news/preview/${val._id}`)
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
    handleDestroyList () {
      const list = this.multipleSelection.map(el => el._id)
      api.put(`${url}`, {list: list, state: 'deleted'}).then(result => {
        this.$notify.success('success')
        this.fetch()
      }).catch(err => {
        console.log(err)
        this.$notify.error(err.toString())
      })
    },
    preFetch () {
      this.currentPage = 1
      this.fetch()
    },
    fetch () {
      this.loading = true
      const params = Object.assign(this.$route.query, this.params)
      params.start = this.currentPage
      if (params.timerange.length <= 1) {
        delete params.timerange
      } else {
        params.timestart = Date.parse(params.timerange[0]).toString().substring(0, 10)
        params.timeend = Date.parse(params.timerange[1]).toString().substring(0, 10)
      }
      console.log(JSON.stringify(params))

      api.get(url, {params: params}).then((result) => {
        this.loading = false
        if (result.data.data === null) {
          this.$notify.error('无数据!!')
          return
        }
        this.listData = result.data
      }).catch(error => {
        console.log(error)
        this.loading = false
        this.$notify.error('请求失败')
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    tableRowClassName (row, index) {
      if (row.is_cn) {
        return 'cn-row'
      }
      return ''
    }
  },
  watch: {
    'listData.data': function (val) {
      val = val.forEach(el => {
        if (!el.edited_title) {
          el.edited_title = el.trans_title
        }
        if (el.state === 'recommend') {
          el.state = '🚀'
        } else if (el.state === 'normal') {
          el.state = '🔖'
        } else if (el.state === 'pending') {
          el.state = '🚧'
        } else if (el.state === 'deleted') {
          el.state = '❌'
        }
      })
    },
    '$route.query': function () {
      setTimeout(() => { this.fetch() }, 100)
    }
  },
  beforeMount () {
    this.fetch()
    ws(this)
    setInterval(() => {
      checkLock(this)
    }, 2000)
  }
}

function ws (_this) {
  const socket = new WebSocket(`${config.ws}?userid=${localStorage.getItem('userid')}&?nickname=${localStorage.getItem('nickname')}`)
  socket.onopen = function open () {
    console.log('open')
  }
  socket.onclose = function close () {
    console.log('close')
  }
  socket.onmessage = function incoming (data) {
    console.log('onmessage')
    // console.log(data.data)
    const json = JSON.parse(data.data)
    if (json.channel === 'locked') {
      _this.locked = json.data
    }
  }
}

function checkLock (_this) {
  if (_this.locked.length <= 0) {
    return
  }
  _this.locked.forEach(lock => {
    _this.listData.data.forEach((el, index) => {
      el['lock'] = el._id === lock.article
      _this.$set(_this.listData.data, index, el)
    })
  })
}

</script>

<style lang="stylus">
#admin-articles
  .title
    display flex
    align-items center
    justify-content space-between


  .search-input
    width 150px
  .search-options
    width 150px
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
    margin-bottom 40px
  .deleted
    color rgb(255, 102, 96)
  .language-icon
    width 20px
  .timerange
    margin-bottom 15px

  .el-table .cn-row
    background #c9e5f5
  .el-table .positive-row
    background #e2f0e4
  .el-tabs
    display inline-block
    margin-top 13px
  .actions
    margin 10px 0
  .source
    width 20px
    height 20px
    vertical-align middle
  img
    cursor pointer
  .clear
    margin 0 10px



</style>
