import api from '../stores/api'

export default (options) => {
  let {
    methods = {},
    data = {},
    watch = {}
  } = options

  methods = Object.assign({
    handleSizeChange (index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange (index, val) {
      this.params.start = index
      this.fetch()
    },
    handleDestroy (index, val, list) {
      api.delete(`${options.url}/${val._id}`, {}).then((result) => {
        this.$message.success('success')
        list.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    fetch () {
      api.get(options.url, {params: this.params}).then((result) => {
        this.listData = result.data.data
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    }
  }, methods)
  watch = Object.assign({
  }, watch)

  data = Object.assign({
    params: {
      start: 1
    },
    listData: {
      meta: {
        total_count: 0,
        limit_value: 0
      }
    }
  }, data)

  const base = {
    data () {
      return data
    },
    methods: methods,
    watch: watch,
    beforeMount () {
      this.fetch()
    }
  }
  return base
}
