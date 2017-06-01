<template lang="jade">
#admin-articles.admin
  .title
    h1 {{$route.meta.title}}
    vsearch(type='Article', kw='edited_title', :cb='search')
  el-table(:data='listData.list', border)
    el-table-column(type="index", width="100")
    el-table-column(prop='edited_title', label='标题')
    el-table-column(prop='order', label=' 状态', width="100")
    el-table-column(prop='published', label='创建时间', width="200")
    el-table-column(label='操作', width='250')
      template(scope='scope')
        el-button(size='small',
                  @click='handleEdit(scope.$index, scope.row)') 编辑
        el-button(size='small',
                  @click='stateVisible = true, currentRow = scope.row') 状态
        el-button(size='small',
                  @click='previewVisible = true, currentRow = scope.row') 预览
        el-button(size='small',
                  type='danger',
                  @click='handleDelete(scope.$index, scope.row)') 删除
  el-pagination(@size-change='handleSizeChange',
                @current-change='handleCurrentChange',
                :current-page='currentPage',
                :page-size='listData.meta.limit_value',
                layout='total, prev, pager, next',
                :total='listData.meta.total_count')
  el-dialog(:title='currentRow.edited_title', v-model='previewVisible', size='tiny')
    p(v-html='currentRow.edited_content')
    span.dialog-footer(slot='footer')
      el-button(@click='previewVisible = false') 取 消
      el-button(type='primary', @click='previewVisible = false') 确 定
  el-dialog(:title='currentRow.edited_title', v-model='stateVisible', size='tiny')
    el-select(v-model='currentRow.order', placeholder='请选择')
      el-option(v-for='item in options', :label='item.label', :value='item.value')
    span.dialog-footer(slot='footer')
      el-button(@click='stateVisible = false') 取 消
      el-button(type='primary', @click='editState') 确 定
</template>

<script>
import api from 'stores/api'
import tools from '../../tools'
const options = {
  url: 'admin/articles'
}
export default {
  data() {
    return {
      params: {
        last: null,
        first: null,
        limit: 20,
      },
      listData: {
        meta: {
          total_count: 0,
          limit_value: 0
        }
      },
      previewVisible: false,
      stateVisible: false,
      currentRow: {},
      currentPage: 1,
      options: [{
        value: -1,
        label: '隐藏'
      }, {
        value: 0,
        label: '正常显示'
      }, {
        value: 1,
        label: '编辑推荐'
      }],
    }
  },
  methods: {
    search (val) {
      this.listData = val
    },
    handleEdit (index, el) {
      this.$router.push(`/posts/edit?id=${el._id}`)
    },
    editState() {
      api.put(`admin/articles/${this.currentRow._id}`, {
        order: this.currentRow.order
      }).then(result => {
        this.$message.success('success')
        this.stateVisible = false
      },error => {
        this.$message.error('error')
        this.stateVisible = false
      })
    },
    handleSizeChange(index, val) {
      console.log(`每页 ${index} 条`)
    },
    handleCurrentChange(index, val) {
      if (index > this.currentPage) {
        const last  = this.listData.list[this.listData.list.length - 1]._id
        this.params.last = last
        this.params.first = null
      } else if (index < this.currentPage){
        const first  = this.listData.list[0]._id
        this.params.first = first
        this.params.last = null
      }
      this.currentPage = index

      this.fetch()
    },
    handleDestroy(index, val, list) {
      api.delete(`${options.url}/${val._id}`, {}).then((result) => {
        this.$message.success('success')
        list.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message.error(err.toString())
      })
    },
    fetch() {
      api.get(options.url, {params: this.params}).then((result) => {
        this.listData = result.data.data
      }).catch((err) => {
        console.log(err)
         this.$message.error(err.toString())
      })
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
        el.published = tools.moment(el.published)
      })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus">
.el-dialog div
  img, iframe
    width 100%
</style>
