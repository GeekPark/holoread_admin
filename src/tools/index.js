import WangEditor from 'wangeditor'

const FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default {
  moment: (obj, format = FORMAT) => {
    return window.moment(obj).format(format)
  },
  utc: (obj, format = FORMAT) => {
    return window.moment(obj).utc().format(format)
  },
  editor: function (vm) {
    const editor = new WangEditor('#editor')
    editor.create()
    vm.$store.commit('SET_EDITOR', editor)
  }
}
