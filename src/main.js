import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import { initRouterPersistence, getSavedRoute, shouldRestoreRoute } from './utils/router-persistence'

// 开发环境测试
if (process.env.NODE_ENV === 'development') {
  import('./utils/env-test.js').then(module => {
    module.testEnvironmentVariables()
  }).catch(error => {
    console.warn('环境变量测试加载失败:', error)
  })
  
  // 路由调试工具
  import('./utils/router-debug.js').then(module => {
    module.initRouterDebug()
  }).catch(error => {
    console.warn('路由调试工具加载失败:', error)
  })
}

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
    console.log(`尝试恢复上次的路由: ${savedRoute}`)
    
    // 检查路由是否存在
    const matched = router.resolve(savedRoute)
    if (matched.matched.length > 0) {
      // 路由存在，进行跳转
      router.replace(savedRoute)
    } else {
      console.warn(`保存的路由不存在: ${savedRoute}`)
    }
  }
  
  // 挂载应用
  app.mount('#app')
}) 
