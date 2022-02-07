import { createRouter, createWebHistory } from 'vue-router'
import ViewProduct from '../views/ViewProduct.vue'
import ViewSale from '../views/ViewSale.vue'

const routes = [
  {
    path: '/',
    name: 'root',
    component: ViewProduct
  },
  {
    path: '/sale',
    name: 'sale',
    component: ViewSale
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
