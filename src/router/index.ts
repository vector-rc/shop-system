import { createRouter, createWebHistory } from 'vue-router'
import ViewProduct from '../views/ViewProduct.vue'
import ViewSale from '../views/ViewSale.vue'
import ListSales from '../components/Sale/ListSales.vue'
import ViewPrinters from '../views/ViewPrinters.vue'
import ViewLogin from '../views/ViewLogin.vue'
import ViewSignup from '../views/ViewSignup.vue'
import ViewBarcodes from '../views/ViewBarcodes.vue'
import ViewProofPayments from '../views/ViewProofPayments.vue'
import ViewProfile from '../views/ViewProfile.vue'
import NewSale from '../components/Sale/NewSale.vue'
import NewProduct from '../components/Product/WriteProduct.vue'
import ListUsers from '../components/User/ListUsers.vue'
import ViewReports from '../views/ViewReports.vue'

import store from '../store'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: ViewLogin
  },
  {
    path: '/profile',
    name: 'profile',
    component: ViewProfile
  },
  {
    path: '/sales',
    name: 'sales',
    component: ViewSale
  },
  {
    path: '/listSales',
    name: 'listSales',
    component: ListSales
  },
  {
    path: '/newSale',
    name: 'newSale',
    component: NewSale
  },
  {
    path: '/printers',
    name: 'printers',
    component: ViewPrinters
  },
  {
    path: '/products',
    name: 'products',
    component: ViewProduct
  },
  {
    path: '/newProduct',
    name: 'newProduct',
    component: NewProduct
  },
  {
    path: '/signup',
    name: 'signup',
    component: ViewSignup
  },
  {
    path: '/users',
    name: 'users',
    component: ListUsers
  },
  {
    path: '/barcodes',
    name: 'barcodes',
    component: ViewBarcodes
  },
  {
    path: '/comprobante/:encodeData',
    name: 'comprobante',
    component: ViewProofPayments
  },
  {
    path: '/reports',
    name: 'reports',
    component: ViewReports
  }

]

const router = createRouter({
  history: createWebHistory('vilcherrez'),
  routes
})

router.beforeEach(async (to:any, from:any) => {
  if (to.name === 'comprobante') {
    return
  }
  if (!store.state.isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
  if (store.state.isAuthenticated && to.name === 'login') return { name: 'sales' }
})

export default router
