import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.use(router)

// 创建一个初始化函数
const init = async () => {
  const authStore = useAuthStore()
  await authStore.checkAuth()  // 等待 checkAuth 完成
  app.mount('#app')
}

// 执行初始化
init() 