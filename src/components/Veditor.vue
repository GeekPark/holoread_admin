<template lang="jade">
#veditor
  #editor(style="height:400px;max-height:1000px;")
</template>

<script>
import tools from '../tools'

export default {
  name: 'veditor',
  mounted () {
    setTimeout(() => {
      tools.editor(this)
    }, 200)
  }
}
</script>

<style lang="stylus" scoped>
#veditor
  font initial
  margin-bottom 30px
</style>
