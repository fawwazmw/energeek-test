import { createApp } from 'vue'
import App from './App.vue'
import router from './routes' // Import router
import pinia from './stores' // Import pinia

import './assets/main.css'
import './assets/base.css' // Global base styles
import './assets/forms.css' // Form-specific styles

const app = createApp(App)

app.use(pinia) // Use Pinia
app.use(router) // Use Vue Router

app.mount('#app')
