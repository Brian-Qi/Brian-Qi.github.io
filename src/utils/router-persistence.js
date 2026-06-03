/**
 * 路由持久化工具
 * 用于在页面刷新后保持当前路由状态
 */

import { STORAGE_KEYS } from './storage'

// 路由持久化配置
const ROUTER_CONFIG = {
  // 需要排除的路由（不保存）
  EXCLUDED_ROUTES: [
    '/',                     // 首页
    '/coming-soon',          // 建设中页面
    '/achievements'          // 成就图鉴（通常作为入口点）
  ],
  
  // 需要特殊处理的成就解锁页面
  ACHIEVEMENT_ROUTES: [
    '/who_i_am/achieve_idle',
    '/who_i_am/achieve_idle/achieve_super_idle',
    '/achieve_slacking',
    '/who_i_am/secret_quiz/achieve_true_bro',
    '/who_i_am/fortune/achieve_lucky_strike',
    '/who_i_am/fortune/achieve_turn_the_tide',
    '/who_i_am/fortune/achieve_fate_blessed',
    '/who_i_am/hidden_achievement_music'
  ],
  
  // 存储键名
  STORAGE_KEYS: {
    LAST_ROUTE: 'last_visited_route',
    LAST_ROUTE_TIMESTAMP: 'last_route_timestamp',
    ROUTE_HISTORY: 'route_history'
  }
}

/**
 * 检查是否为需要排除的路由
 * @param {string} path - 路由路径
 * @returns {boolean} 是否排除
 */
function isExcludedRoute(path) {
  return ROUTER_CONFIG.EXCLUDED_ROUTES.some(route => path === route)
}

/**
 * 检查是否为成就解锁页面
 * @param {string} path - 路由路径
 * @returns {boolean} 是否为成就页面
 */
function isAchievementRoute(path) {
  return ROUTER_CONFIG.ACHIEVEMENT_ROUTES.some(route => path === route)
}

/**
 * 保存当前路由
 * @param {string} path - 当前路由路径
 */
export function saveCurrentRoute(path) {
  try {
    // 检查是否排除
    if (isExcludedRoute(path)) {
      return
    }
    
    // 保存最后访问的路由
    localStorage.setItem(ROUTER_CONFIG.STORAGE_KEYS.LAST_ROUTE, path)
    localStorage.setItem(ROUTER_CONFIG.STORAGE_KEYS.LAST_ROUTE_TIMESTAMP, Date.now().toString())
    
    // 更新路由历史（最多保存最近10个）
    const history = getRouteHistory()
    const lastEntry = history[history.length - 1]
    
    // 如果最后一个不是当前路由，则添加
    if (!lastEntry || lastEntry.path !== path) {
      // 如果是成就页面，短暂保存（5分钟）
      const ttl = isAchievementRoute(path) ? 5 * 60 * 1000 : 24 * 60 * 60 * 1000 // 5分钟或24小时
      
      history.push({
        path,
        timestamp: Date.now(),
        ttl
      })
      
      // 限制历史记录长度
      if (history.length > 10) {
        history.shift()
      }
      
      localStorage.setItem(ROUTER_CONFIG.STORAGE_KEYS.ROUTE_HISTORY, JSON.stringify(history))
    }
    
  } catch (error) {
    // 保存失败，静默处理
  }
}

/**
 * 获取保存的路由
 * @returns {string|null} 路由路径或null
 */
export function getSavedRoute() {
  try {
    const path = localStorage.getItem(ROUTER_CONFIG.STORAGE_KEYS.LAST_ROUTE)
    const timestamp = localStorage.getItem(ROUTER_CONFIG.STORAGE_KEYS.LAST_ROUTE_TIMESTAMP)
    
    // 检查是否过期（超过24小时）
    if (path && timestamp) {
      const timeDiff = Date.now() - parseInt(timestamp, 10)
      const isAchievement = isAchievementRoute(path)
      const maxAge = isAchievement ? 5 * 60 * 1000 : 24 * 60 * 60 * 1000 // 5分钟或24小时
      
      if (timeDiff < maxAge) {
        return path
      } else {
        // 过期了，清除
        clearSavedRoute()
        return null
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

/**
 * 获取路由历史
 * @returns {Array} 路由历史记录
 */
export function getRouteHistory() {
  try {
    const history = localStorage.getItem(ROUTER_CONFIG.STORAGE_KEYS.ROUTE_HISTORY)
    if (history) {
      const parsed = JSON.parse(history)
      const now = Date.now()
      
      // 过滤过期项
      const valid = parsed.filter(entry => now - entry.timestamp < entry.ttl)
      
      // 如果有过期项，保存过滤后的列表
      if (valid.length !== parsed.length) {
        localStorage.setItem(ROUTER_CONFIG.STORAGE_KEYS.ROUTE_HISTORY, JSON.stringify(valid))
      }
      
      return valid
    }
  } catch (error) {
    // 获取失败，静默处理
  }
  
  return []
}

/**
 * 清除保存的路由
 */
export function clearSavedRoute() {
  try {
    localStorage.removeItem(ROUTER_CONFIG.STORAGE_KEYS.LAST_ROUTE)
    localStorage.removeItem(ROUTER_CONFIG.STORAGE_KEYS.LAST_ROUTE_TIMESTAMP)
  } catch (error) {
    // 清除失败，静默处理
  }
}

/**
 * 清除所有路由历史
 */
export function clearAllRouteHistory() {
  try {
    clearSavedRoute()
    localStorage.removeItem(ROUTER_CONFIG.STORAGE_KEYS.ROUTE_HISTORY)
  } catch (error) {
    // 清除失败，静默处理
  }
}

/**
 * 检查是否应该恢复路由
 * @param {string} currentPath - 当前路径
 * @returns {boolean} 是否应该恢复
 */
export function shouldRestoreRoute(currentPath) {
  // 如果是排除的路由，不恢复
  if (isExcludedRoute(currentPath)) {
    return false
  }
  
  // 如果是成就页面，检查是否应该显示（基于解锁状态）
  if (isAchievementRoute(currentPath)) {
    const savedRoute = getSavedRoute()
    return savedRoute === currentPath
  }
  
  // 其他页面都允许恢复
  return true
}

/**
 * 路由守卫 - 保存路由的中间件
 * @param {Object} to - 目标路由
 * @param {Object} from - 来源路由
 * @param {Function} next - 继续函数
 */
export function routeGuard(to, from, next) {
  // 保存即将离开的路由
  if (from && from.path) {
    saveCurrentRoute(from.path)
  }
  
  next()
}

/**
 * 初始化路由持久化
 * @param {Object} router - Vue Router 实例
 */
export function initRouterPersistence(router) {
  // 添加路由守卫
  router.beforeEach(routeGuard)
  
  // 页面刷新前保存当前路由
  window.addEventListener('beforeunload', () => {
    if (router.currentRoute && router.currentRoute.value) {
      saveCurrentRoute(router.currentRoute.value.path)
    }
  })
}