/**
 * 统一存储管理模块
 * 管理所有 localStorage 键名，避免硬编码和命名冲突
 */

// ========== 存储键名常量 ==========
export const STORAGE_KEYS = {
  // 成就相关
  ACHIEVEMENTS: {
    IDLE: 'achieve_idle',
    SUPER_IDLE: 'achieve_02',
    SLACKING: 'achieve_03',
    TRUE_BRO: 'achieve_04',
    LUCKY_STRIKE: 'achieve_05',
    TURN_TIDE: 'achieve_06',
    FATE_BLESSED: 'achieve_fate_blessed'
  },
  
  // 游戏相关
  GAME: {
    ENDINGS: 'story_endings',
    SECRET_ROOM_VISITED: 'hasVisitedSecretRoom',
    SECRET_ROOM_UNLOCKED: 'secret_room_unlocked'
  },
  
  // 运势相关
  FORTUNE: {
    COLLECTED: 'collected_fortunes',
    DAILY_HISTORY: 'dailyFortuneHistory'
  },
  
  // 用户相关
  USER: {
    IDENTIFIER: 'user_identifier',
    GUESTBOOK_ACCESS: 'guestbook_access_granted',
    QUIZ_ATTEMPTS: 'quiz_attempts_count'
  },
  
  // 版本控制
  VERSION: {
    DATA_VERSION: 'app_data_version'
  }
}

// ========== 当前数据版本 ==========
const CURRENT_DATA_VERSION = '1.0.0'

// ========== 存储工具函数 ==========

/**
 * 安全获取 localStorage 项
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
export function getItem(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : defaultValue
  } catch (error) {
    console.error(`读取 localStorage 失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 安全设置 localStorage 项
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`写入 localStorage 失败 (${key}):`, error)
  }
}

/**
 * 安全移除 localStorage 项
 * @param {string} key - 存储键名
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`移除 localStorage 失败 (${key}):`, error)
  }
}

/**
 * 检查键是否存在
 * @param {string} key - 存储键名
 * @returns {boolean} 是否存在
 */
export function hasItem(key) {
  return localStorage.getItem(key) !== null
}

/**
 * 清空所有应用相关存储
 * 保留用户标识和版本信息
 */
export function clearAppData() {
  Object.keys(STORAGE_KEYS).forEach(category => {
    Object.values(STORAGE_KEYS[category]).forEach(key => {
      // 保留用户标识和版本信息
      if (key !== STORAGE_KEYS.USER.IDENTIFIER && key !== STORAGE_KEYS.VERSION.DATA_VERSION) {
        removeItem(key)
      }
    })
  })
  console.log('应用数据已清除')
}

/**
 * 检查并升级数据版本
 * 当数据结构发生变化时使用
 */
export function checkAndUpgradeDataVersion() {
  const storedVersion = getItem(STORAGE_KEYS.VERSION.DATA_VERSION, '0.0.0')
  
  if (storedVersion !== CURRENT_DATA_VERSION) {
    console.log(`数据版本升级: ${storedVersion} -> ${CURRENT_DATA_VERSION}`)
    
    // 这里可以添加版本升级逻辑
    // 例如：v1.0.0 -> v1.1.0 的数据迁移
    
    setItem(STORAGE_KEYS.VERSION.DATA_VERSION, CURRENT_DATA_VERSION)
  }
}

/**
 * 获取所有成就的解锁状态
 * @returns {Object} 成就解锁状态对象
 */
export function getAllAchievementStatus() {
  const status = {}
  Object.entries(STORAGE_KEYS.ACHIEVEMENTS).forEach(([name, key]) => {
    status[name] = hasItem(key)
  })
  return status
}

/**
 * 解锁成就
 * @param {string} achievementKey - 成就键名
 * @returns {boolean} 是否成功解锁
 */
export function unlockAchievement(achievementKey) {
  if (!Object.values(STORAGE_KEYS.ACHIEVEMENTS).includes(achievementKey)) {
    console.error(`无效的成就键名: ${achievementKey}`)
    return false
  }
  
  if (!hasItem(achievementKey)) {
    setItem(achievementKey, true)
    console.log(`成就解锁: ${achievementKey}`)
    return true
  }
  return false
}

/**
 * 重置所有成就（开发/测试用）
 */
export function resetAllAchievements() {
  Object.values(STORAGE_KEYS.ACHIEVEMENTS).forEach(key => {
    removeItem(key)
  })
  console.log('所有成就已重置')
}

// ========== 初始化 ==========
// 应用启动时检查数据版本
checkAndUpgradeDataVersion()