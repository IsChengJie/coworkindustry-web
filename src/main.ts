import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { useAuthStore } from './store/auth'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.checkAuth()  // 检查登录状态

app.mount('#app') 