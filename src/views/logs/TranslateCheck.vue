<template lang="jade">
#admin-accesses.admin
  .title
    h1 {{$route.meta.title}}
    h1 {{label}}
  el-table(:data='listData.data', border)
    el-table-column(prop="", label="translate")
      template(scope='scope')
        p {{scope.row.origin}}
        p {{scope.row.translate}}
        a(:href='scope.row.url', target='_blank') {{scope.row.url}}
    el-table-column(prop='Date', label='创建时间', width="200")
  el-pagination(
                @current-change='handleCurrentChange',
                :current-page='params.start',
                :page-size='params.count',
                layout='total, prev, pager, next',
                :total='listData.total')
</template>

<script>
const url = 'admin/translatelogs/check'
import api from 'stores/api'
import tools from '../../tools'

export default {
  data () {
    return {
      params: {
        start: 0,
        count: 40
      },
      label: '',
      listData: {
        data: [],
        total: 0
      }
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.params.start = index
      this.fetch()
    },
    fetch () {
      this.loading = true
      this.label = '正在检查最近500条记录, 大约需要一分钟, 请等待, 结果缓存一小时'
      api.get(url, {params: this.params}).then((result) => {
        this.loading = false
        this.label = ''
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
    }
  },
  watch: {
    'listData.data': function (val) {
      val = val.forEach(el => {
        el.Date = tools.moment(el.Date)
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

<style lang="stylus" scoped>
</style>
