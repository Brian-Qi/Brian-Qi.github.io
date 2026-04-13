/**
 * 路由调试工具
 * 用于开发和调试路由持久化功能
 */

import { getSavedRoute, getRouteHistory, clearSavedRoute, clearAllRouteHistory } from './router-persistence'

/**
 * 显示路由调试信息
 */
export function showRouterDebugInfo() {
  const savedRoute = getSavedRoute()
  const routeHistory = getRouteHistory()
  
  console.group('🔧 路由调试信息')
  console.log('📌 当前URL:', window.location.href)
  console.log('📌 当前路径:', window.location.pathname)
  console.log('💾 保存的路由:', savedRoute || '无')
  console.log('📚 路由历史:', routeHistory)
  console.log('🗺️ 总历史记录数:', routeHistory.length)
  console.groupEnd()
  
  // 在页面右下角显示浮动调试面板（仅开发环境）
  if (process.env.NODE_ENV === 'development') {
    createFloatingDebugPanel()
  }
  
  return { savedRoute, routeHistory }
}

/**
 * 创建浮动调试面板
 */
function createFloatingDebugPanel() {
  // 检查是否已存在
  if (document.getElementById('router-debug-panel')) {
    return
  }
  
  const panel = document.createElement('div')
  panel.id = 'router-debug-panel'
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 1px solid #333;
  `
  
  const savedRoute = getSavedRoute()
  const routeHistory = getRouteHistory()
  
  panel.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; color: #4dabf7;">🔄 路由持久化调试</div>
    <div style="margin-bottom: 4px; font-size: 10px; opacity: 0.8;">当前: ${window.location.pathname}</div>
    <div style="margin-bottom: 4px; font-size: 10px; color: ${savedRoute ? '#69db7c' : '#ff6b6b'}">
      保存: ${savedRoute || '无'}
    </div>
    <div style="margin-bottom: 8px; font-size: 10px; opacity: 0.7;">
      历史: ${routeHistory.length} 条
    </div>
    <div style="display: flex; gap: 6px; margin-top: 8px;">
      <button onclick="window.__routerDebug?.refresh()" style="padding: 4px 8px; background: #4dabf7; border: none; border-radius: 4px; color: white; font-size: 10px; cursor: pointer;">
        刷新
      </button>
      <button onclick="window.__routerDebug?.clear()" style="padding: 4px 8px; background: #ff6b6b; border: none; border-radius: 4px; color: white; font-size: 10px; cursor: pointer;">
        清除
      </button>
      <button onclick="window.__routerDebug?.hide()" style="padding: 4px 8px; background: #495057; border: none; border-radius: 4px; color: white; font-size: 10px; cursor: pointer;">
        隐藏
      </button>
    </div>
  `
  
  document.body.appendChild(panel)
  
  // 暴露全局调试方法
  window.__routerDebug = {
    refresh: () => {
      panel.remove()
      createFloatingDebugPanel()
      showRouterDebugInfo()
    },
    clear: () => {
      clearSavedRoute()
      clearAllRouteHistory()
      panel.remove()
      createFloatingDebugPanel()
      console.log('路由状态已清除')
    },
    hide: () => {
      panel.remove()
    },
    show: () => {
      createFloatingDebugPanel()
    }
  }
}

/**
 * 添加键盘快捷键
 */
function addKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+R 显示路由调试
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault()
      showRouterDebugInfo()
    }
    
    // Ctrl+Shift+C 清除路由状态
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      clearSavedRoute()
      clearAllRouteHistory()
      console.log('路由状态已清除')
      showRouterDebugInfo()
    }
  })
}

/**
 * 初始化路由调试
 */
export function initRouterDebug() {
  if (process.env.NODE_ENV === 'development') {
    // 添加键盘快捷键
    addKeyboardShortcuts()
    
    // 延迟显示，等待页面加载
    setTimeout(() => {
      showRouterDebugInfo()
      
      // 监听路由变化
      if (window.__VUE_ROUTER__) {
        window.__VUE_ROUTER__.afterEach((to, from) => {
          console.log(`路由变化: ${from.path} -> ${to.path}`)
          if (window.__routerDebug) {
            window.__routerDebug.refresh()
          }
        })
      }
    }, 1000)
    
    console.log('路由调试工具已初始化')
  }
}

// 自动初始化（开发环境）
if (process.env.NODE_ENV === 'development') {
  initRouterDebug()
}