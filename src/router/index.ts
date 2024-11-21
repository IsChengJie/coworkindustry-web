import { createRouter, createWebHistory, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../store'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'visitors',
        name: 'visitors',
        component: () => import('../views/visitors/VisitorList.vue')
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import('../views/employees/EmployeeList.vue')
      },
      {
        path: 'spaces',
        component: () => import('../views/spaces/index.vue'),
        children: [
          {
            path: '',
            redirect: '/spaces/bookings'
          },
          {
            path: 'bookings',
            name: 'space-bookings',
            component: () => import('../views/spaces/bookings/index.vue')
          },
          {
            path: 'resource-availability',
            name: 'resource-availability',
            component: () => import('../views/spaces/resource-availability/index.vue')
          }
        ]
      },
      {
        path: 'deliveries',
        name: 'deliveries',
        component: () => import('../views/deliveries/DeliveryList.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/settings/Settings.vue')
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router 