import { createRouter, createWebHistory } from 'vue-router'
import ViewProduct from '../views/ViewProduct.vue'
import ViewSale from '../views/ViewSale.vue'
import ViewPrinters from '../views/ViewPrinters.vue'

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
  },
  {
    path: '/printers',
    name: 'printers',
    component: ViewPrinters
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
