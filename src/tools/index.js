
import config     from '../config.js'
// console.log(config);
const domain = config.qiniu

function printLog(title, info) {
  window.console && console.log(title, info);
}

export default {
  moment: (obj, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(obj).format(format)
  },
  editor: function (vm) {
    const editor = new wangEditor('#editor');
    editor.create();
    vm.$store.commit('SET_ITEM', { key: 'htmlEditor', val: editor })
  }
}
