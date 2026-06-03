import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import { initRouterPersistence, getSavedRoute, shouldRestoreRoute } from './utils/router-persistence'



// 创建应用
const app = createApp(App)

// 应用挂载前的路由恢复逻辑
app.use(router)

// 初始化路由持久化
initRouterPersistence(router)

// 检查是否有保存的路由需要恢复
router.isReady().then(() => {
  const savedRoute = getSavedRoute()
  const currentPath = router.currentRoute.value.path
  
  if (savedRoute && savedRoute !== currentPath && shouldRestoreRoute(currentPath)) {
    // 检查路由是否存在
    const matched = router.resolve(savedRoute)
    if (matched.matched.length > 0) {
      // 路由存在，进行跳转
      router.replace(savedRoute)
    }
  }
  
  // 挂载应用
  app.mount('#app')
}) 
