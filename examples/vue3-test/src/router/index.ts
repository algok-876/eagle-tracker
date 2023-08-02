import { createRouter, createWebHistory } from "vue-router"
import { getPageRecord, useBeforeSendData, TransportCategory } from "@eagle-tracker/vue3"
const routes = [
  { path: '/', component: () => import('../views/index.vue') },
  { path: '/page1', component: () => import('../views/page1.vue') },
  { path: '/page2', component: () => import('../views/page2.vue') },
  { path: '/page3', component: () => import('../views/page3.vue') },
  { path: '/page4', component: () => import('../views/page4.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.afterEach(() => {
  console.log(getPageRecord())
})
useBeforeSendData((category, context) => {
  if (category === TransportCategory.ONLINE) {
    console.log(context.context)
  }
})

export default router