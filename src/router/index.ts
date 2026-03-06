import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/doces',
      name: 'candies',
      component: () => import('@/views/candies/CandiesListView.vue')
    },
    {
      path: '/doces/novo',
      name: 'candies-new',
      component: () => import('@/views/candies/CandyFormView.vue')
    },
    {
      path: '/doces/:id/editar',
      name: 'candies-edit',
      component: () => import('@/views/candies/CandyFormView.vue'),
      props: true
    },
    {
      path: '/propostas',
      name: 'proposals',
      component: () => import('@/views/proposals/ProposalsListView.vue')
    },
    {
      path: '/propostas/nova',
      name: 'proposals-new',
      component: () => import('@/views/proposals/ProposalFormView.vue')
    },
    {
      path: '/propostas/:id',
      name: 'proposals-details',
      component: () => import('@/views/proposals/ProposalDetailsView.vue'),
      props: true
    }
  ]
})

export default router
