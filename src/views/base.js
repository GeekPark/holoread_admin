import api from '../stores/api'

function fetch (_this = {}, params = {}, url = '') {
  api.get(url, params).then((result) => {
    // console.log(result)
    _this.listData = result.data.data
  }).catch((err) => {
    console.log(err)
     _this.$message.error(err.toString())
  })
}

function destroy (_this = {}, params = {}, url = '') {
  api.delete(url, params).then((result) => {
    _this.$message.success('success')
  }).catch((err) => {
    console.log(err)
     _this.$message.error(err.toString())
  })
}

export default (options) => {
  let {methods = {}} = options
  const base =  {
    computed: {
    },
    data () {
      return {
        currentPage: 1,
        listData: {
          meta: {
            total_count: 0,
            limit_value: 0
          }
        }
      }
    },
    methods: {
      handleSizeChange(index, val) {
        console.log(`每页 ${index} 条`)
      },
      handleCurrentChange(index, val) {
        fetch(this, {page: index}, options.url)
        console.log(`当前页: ${index}`)
      },
      handleDestroy(index, val) {
        destroy(this, {}, `${options.url}/${val.id}`)
      },
      methods
    },
    watch:{
      'listData.posts': function (val) {
        val.forEach(el => {
          if (el.state === 'published') {el.state = '已发布'}
        })
      }
    },
    beforeMount () {
      fetch(this, {page: this.currentPage}, options.url)
    }
  }
  return base
}
