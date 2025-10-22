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
  ],
})

export default router
