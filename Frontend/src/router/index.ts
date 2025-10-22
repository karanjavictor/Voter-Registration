import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/Pages/Home.vue'),
    },
    {
      path: '/voter-registration',
      name: 'voter-registration',
      component: () => import('@/Pages/VoterRegistration.vue'),
    },
    {
      path: '/voter-check',
      name: 'voter-check',
      component: () => import('@/Pages/VoterCheck.vue'),
    },
  ],
})

export default router
