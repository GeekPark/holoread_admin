<template lang="jade">
#preview
  h1.title {{article.edited_title}}
  p.info
    span {{article.ago}}前 | {{article.source}}
    span.r(@click="isOrigin = !isOrigin") 原文
    span.r 分享
    span.r 收藏
  p.content(v-html='content')

</template>

<script>
import api from 'stores/api'
export default {
  data () {
    return {
      article: {},
      isOrigin: false
    }
  },
  computed: {
    content () {
      return this.isOrigin ? this.article.origin_content : this.article.edited_content
    }
  },
  mounted() {
    api.get(`v1/articles/${this.$route.params.id}`)
    .then(result => {
      this.article = result.data.data
      console.log(result)
    }, error => {

    })
    document.getElementById('vheader').style.display = 'none'
    document.getElementById('vsider').style.display = 'none'
  },
  watch: {
    'article' (value) {
      value.ago = timeSince(new Date(value.published))
    }
  }
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + "y"; //years
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + "M"; // months
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + "d"; // days
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + "h"; // hours
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + "m"; //minutes
  }
  return Math.floor(seconds) + "s"; //seconds
}
</script>

<style lang="stylus" >
#preview
  padding 12px
  width calc(100% - 24px)
  color rgba(51,51,51,1)
  .title
    font-family 'PingFangSC-Medium'
    font-size 21px
    line-height 31px
  .info
    color rgba(153,153,153,1)
    font-family 'PingFangSC-Light'
    font-size 10px
  .content
    font-family 'PingFangSC-Regular'
    font-size 13px
    line-height 20px

  img
    max-width 100%
    height auto

  a
    color rgba(255,137,50,1)
  .r
    float right



#preview::-webkit-scrollbar
  display:none

</style>
