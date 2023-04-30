import { getAuth } from 'firebase/auth';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      meta: { hideForAuth: true },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { hideForAuth: true },
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/verification',
      name: 'verification',
      meta: { hideForVerified: true },
      component: () => import('../views/VerificationView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = getAuth().currentUser;

  if (to.meta.requiresAuth) {
    if (user === null) {
      next(Routes.login);
      return;
    } else if (!user!.emailVerified) {
      next(Routes.verification);
      return;
    }

    next();
  } else if (to.meta.hideForAuth) {
    if (user === null) {
      next();
      return;
    } else if (!user!.emailVerified) {
      next(Routes.verification);
      return;
    }

    next(Routes.home);
  } else if (to.meta.hideForVerified) {
    if (user === null) {
      next(Routes.login);
      return;
    } else if (!user!.emailVerified) {
      next();
      return;
    }

    next(Routes.home);
  }
});

export default router;

export const enum Routes {
  home = '/',
  login = '/login',
  register = '/register',
  verification = '/verification',
}
