import Vue        from 'vue'
import Vuex       from 'vuex'

import App        from './App'
/* eslint-disable no-new */
import router     from './routers'
import store      from './stores'

import Vsider     from "./components/Vsider.vue"
import Vheader    from "./components/Vheader.vue"
import Vfooter    from "./components/Vfooter.vue"
import Veditor    from "./components/Veditor.vue"
import Element    from 'element-ui'

Vue.component(Vheader.name,   Vheader)
Vue.component(Vfooter.name,   Vfooter)
Vue.component(Vsider.name,    Vsider)
Vue.component(Veditor.name,   Veditor)

Vue.use(Element)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})


