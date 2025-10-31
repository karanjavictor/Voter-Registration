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
    {
      path: '/staff-login',
      name: 'staff-login',
      component: () => import('@/Pages/StaffLogin.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/components/Dashboard/Dashboard.vue'),
      children: [
        {
          path: '/dashboard/dashboard-overview',
          name: 'dashboard-overview',
          component: () => import('@/components/Dashboard/DashboardOverview.vue'),
        },
        {
          path: '/dashboard/create-staff',
          name: 'create-staff',
          component: () => import('@/components/Dashboard/CreateStaff.vue'),
        },
        {
          path: '/dashboard/view-staff',
          name: 'view-staff',
          component: () => import('@/components/Dashboard/ViewStaff.vue'),
        },
        {
          path: '/dashboard/view-voters',
          name: 'view-voters',
          component: () => import('@/components/Dashboard/ViewVoters.vue'),
        },
        {
          path: '/dashboard/view-logs',
          name: 'view-logs',
          component: () => import('@/components/Dashboard/ViewLogs.vue'),
        },
        {
          path: '/dashboard/view-analytics',
          name: 'view-analytics',
          component: () => import('@/components/Dashboard/ViewAnalytics.vue'),
        },
      ],
    },
  ],
})

export default router
