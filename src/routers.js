import Vue from 'vue'
import VueRouter from 'vue-router'

// import Index from './views/Index.vue'
import Errors from './views/Errors.vue'
import Login from './views/Login.vue'

import Posts from './views/posts/Posts.vue'
import EditPost from './views/posts/EditPost.vue'

import Accesses from './views/logs/Accesses.vue'
import TranslateLog from './views/logs/TranslateLog.vue'
import TranslateCheck from './views/logs/TranslateCheck.vue'

import Users from './views/users/Users.vue'
import EditUser from './views/users/EditUser.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/',
      redirect: '/posts'
    },
    { path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '登录'}
    },

    { path: '/users',
      name: 'users',
      component: Users,
      meta: {title: '用户'}
    },
    { path: '/users/edit/:id',
      name: 'users-edited',
      component: EditUser,
      meta: {title: '修改用户'}
    },

    { path: '/accesses',
      name: 'accesses',
      component: Accesses,
      meta: {title: '访问日志'}
    },
    { path: '/translatelog',
      name: 'translatelog',
      component: TranslateLog,
      meta: {title: '翻译日志'}
    },
    { path: '/translate/check',
      name: 'TranslateCheck',
      component: TranslateCheck,
      meta: {title: '翻译检查'}
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
