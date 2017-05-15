import Vue         from 'vue'
import VueRouter   from 'vue-router'
import config      from './config'

import Index       from './views/Index.vue'
import Charts      from './views/Charts.vue'
import Errors      from './views/Errors.vue'
import Login       from './views/Login.vue'

import Posts       from './views/posts/Posts.vue'
import EditPost    from './views/posts/EditPost.vue'

import Logs        from './views/logs/Logs.vue'


import Users       from './views/users/Users.vue'
import AddUser     from './views/users/AddUser.vue'

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/',
      name: 'index',
      component: Index,
      meta: {title: '首页'}
    },
    { path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '登录'}
    },

    { path: '/charts',
      name: 'charts',
      component: Charts,
      meta: {title: 'Charts'}
    },

    { path: '/users',
      name: 'users',
      component: Users,
      meta: {title: '用户'}
    },
    { path: '/users/new',
      name: 'users-new',
      component: AddUser,
      meta: {title: '添加用户'}
    },

    { path: '/logs',
      name: 'logs',
      component: Logs,
      meta: {title: ' 日志'}
    },

    { path: '/posts',
      name: 'posts',
      component: Posts,
      meta: {title: '文章'}
    },
    { path: '/posts/edit',
      name: 'posts-edit',
      component: EditPost,
      meta: {title: '编辑文章'}
    },
    { path: '*',
      component: Errors,
      meta: {title: 'Error'}
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
