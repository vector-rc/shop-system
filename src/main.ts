import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './assets/bulma.min.css'
import './assets/app.css'

const app = createApp(App)
app.use(store).mount('#app')
app.config.globalProperties.$log = console.log
