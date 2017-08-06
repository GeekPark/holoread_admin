import WangEditor from 'wangeditor'

export default {
  moment: (obj, format = 'YYYY-MM-DD HH:mm:ss') => {
    return window.moment(obj).format(format)
  },
  editor: function (vm) {
    const editor = new WangEditor('#editor')
    editor.create()
    vm.$store.commit('SET_EDITOR', editor)
  }
}
