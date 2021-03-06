/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  // Home
  {
    path: '/home',
    name: 'home.index',
    component: () => import('@/views/Home/Index.vue'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: true,
    },
  },

  // Account
  {
    path: '/account',
    name: 'account.index',
    component: () => import('@/views/Account/Index.vue'),

    // If the user needs to be authenticated to view this page.
    meta: {
      auth: true,
    },
  },

  // Login
  {
    path: '/login',
    name: 'login.index',
    component: () => import('@/views/Login/Index.vue'),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true,
    },
  },

  // Register
  {
    path: '/register',
    name: 'register.index',
    component: () => import('@/views/Register/Index.vue'),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true,
    },
  },

  // Question
  {
    path: '/question',
    name: 'question.index',
    component: () => import('@/views/Question/Index.vue'),
    meta: {
      auth: true,
    },
  },

  {
    path: '/question/:id',
    name: 'question.detail',
    component: () => import('@/views/QuestionDetail/Index.vue'),
    meta: {
      auth: true,
    },
  },

  // Feedback
  {
    path: '/feedback',
    name: 'feedback.index',
    component: () => import('@/views/Feedback/Index.vue'),
    meta: {
      auth: true,
    },
  },

  {
    path: '/feedback/:id',
    name: 'feedback.detail',
    component: () => import('@/views/FeedbackDetail/Index.vue'),
    meta: {
      auth: true,
    },
  },

  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/*',
    redirect: '/home',
  },
];
