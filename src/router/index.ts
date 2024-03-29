import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/merchandise/entry',
      name: 'MerchandiseEntry',
      component: () => import('../views/MerchandiseEntryView.vue')
    },
    {
      path: '/merchandise/update/:id',
      name: 'MerchandiseUpdate',
      component: () => import('../views/MerchandiseUpdateView.vue')
    },
    {
      path: '/merchandise/list',
      name: 'MerchandiseList',
      component: () => import('../views/MerchandiseListView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/order/entry',
      name: 'OrderEntry',
      component: () => import('../views/OrderEntryView.vue')
    },
    {
      path: '/order/list',
      name: 'OrderList',
      component: () => import('../views/OrderListView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/order/detail/:id',
      name: 'OrderDetail',
      component: () => import('../views/OrderDetailView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
