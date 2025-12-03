import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // your Pinia store
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

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
      meta: { requiresAuth: true }, // require login for any dashboard child
      children: [
        {
          path: 'dashboard-overview',
          name: 'dashboard-overview',
          component: () => import('@/components/Dashboard/DashboardOverview.vue'),
          meta: {
            // allowed roles: admin, supervisor, staff (staff can access overview)
            roles: ['administrator', 'supervisor', 'clerk'],
          },
        },
        {
          path: 'create-staff',
          name: 'create-staff',
          component: () => import('@/components/Dashboard/CreateStaff.vue'),
          meta: { roles: ['administrator', 'supervisor'] }, // only admin & supervisor
        },
        {
          path: 'view-staff',
          name: 'view-staff',
          component: () => import('@/components/Dashboard/ViewStaff.vue'),
          meta: { roles: ['administrator', 'supervisor'] },
        },
        {
          path: 'view-voters',
          name: 'view-voters',
          component: () => import('@/components/Dashboard/ViewVoters.vue'),
          meta: { roles: ['administrator', 'supervisor', 'clerk'] }, // clerks allowed
        },
        {
          path: 'view-logs',
          name: 'view-logs',
          component: () => import('@/components/Dashboard/ViewLogs.vue'),
          meta: { roles: ['administrator', 'supervisor'] },
        },
        {
          path: 'view-analytics',
          name: 'view-analytics',
          component: () => import('@/components/Dashboard/ViewAnalytics.vue'),
          meta: { roles: ['administrator', 'supervisor'] },
        },
      ],
    },
  ],
})

// Global guard: auth + role-based access
router.beforeEach(async (to: RouteLocationNormalized, _from, next: NavigationGuardNext) => {
  // quick allow for public routes
  if (!to.meta?.requiresAuth) return next()

  // Access Pinia store (ensure Pinia is installed before router in main.ts)
  const auth = useAuthStore()

  // ensure we know auth state; this should call an API that validates cookie/session
  // checkAuth should set auth.isAuthenticated and auth.staff (or clear them)
  if (typeof auth.checkAuth === 'function') {
    try {
      await auth.checkAuth()
    } catch {
      // ignore — checkAuth should set proper state
    }
  }

  // If not authenticated -> redirect to login
  if (!auth.isAuthenticated) {
    return next({ name: 'staff-login', query: { redirect: String(to.fullPath) } })
  }

  // If route defines role restrictions, enforce them
  const allowedRoles: string[] | undefined = (to.meta?.roles as string[] | undefined) ?? undefined

  if (!allowedRoles || allowedRoles.length === 0) {
    // no role restriction on this route (but it's authenticated) -> allow
    return next()
  }

  // Normalize staff role to lowercase for safe comparison
  const staffRole = (auth.staff?.role ?? '').toString().toLowerCase()

  // Normalize allowed roles
  const normalizedAllowed = allowedRoles.map((r) => r.toString().toLowerCase())

  if (normalizedAllowed.includes(staffRole)) {
    return next() // allowed
  }

  // Not allowed: optionally redirect to a safe page (overview) or show a 403 page
  // We'll redirect to dashboard-overview with a query message
  return next(false)
})

export default router
