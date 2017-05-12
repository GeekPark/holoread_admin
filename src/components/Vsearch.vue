<template lang="jade">
#vsearch
  el-input(placeholder='请输入搜索内容',
           icon='search',
           v-model='value',
           :on-icon-click='handleSearch',
           @keyup.enter='handleSearch')
</template>

<script>
import api from '../stores/api'
export default {
  name: 'vsearch',
  data () {
    return {
      value: ''
    }
  },
  props: ['type', 'kw', 'cb'],
  methods: {
    handleSearch() {
      api.get('/admin/search', {
        params: {
          type: this.type,
          kw: this.kw,
          value: this.value
        }
      }).then((result) => {
        this.cb(result.data.data)
      }).catch((err) => {
        this.$message.error(err.toString())
      })
    }
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus">
#vsearch
  float right
</style>

