import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/bulma.min.css'
import './assets/app.css'
import './assets/toast.css'
// import './assets/bootstrap/bootstrap.min.css'
// import './assets/bootstrap/bootstrap-icons.css'
// import './assets/bootstrap/bootstrap.bundle.min.js'

const app = createApp(App)
app.use(store).use(router).mount('#app')
app.config.globalProperties.$log = console.log
