import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/roadmap',
      name: 'roadmap',
      component: () => import('../views/Roadmap.vue')
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('../views/Documents.vue')
    },
    {
      path: '/documents/:slug',
      name: 'document-detail',
      component: () => import('../views/DocumentDetail.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/Categories.vue')
    },
    {
      path: '/categories/:slug',
      name: 'category-detail',
      component: () => import('../views/CategoryDetail.vue')
    }
  ]
})

export default router