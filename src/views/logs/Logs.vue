<template lang="jade">
#admin-users.admin
  .title
    h1 {{$route.meta.title}}
  el-table(:data='listData.data', border)
    el-table-column(prop="ip", label="ip", width='180')
    el-table-column(prop='article.edited_title', label='article')
    el-table-column(prop='created_at', label='创建时间', width="200")
  el-pagination(
                @current-change='handleCurrentChange',
                :current-page='params.start',
                :page-size='params.count',
                layout='total, prev, pager, next',
                :total='listData.total')
</template>

<script>
const url = 'admin/accesses'
import api from 'stores/api'
import tools from '../../tools'

export default {
  data () {
    return {
      params: {
        start: 0,
        count: 20
      },
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
      api.get(url, {params: this.params}).then((result) => {
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
    }
  },
  watch: {
    'listData.data': function (val) {
      val = val.forEach(el => {
        if (el.createdAt) {
          el.created_at = tools.moment(el.createdAt)
        }
        el.article = el.article[0]
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
