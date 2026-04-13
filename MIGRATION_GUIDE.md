# 项目重构迁移指南

## 已完成的高级优先级修改

### 1. 统一存储管理 (`src/utils/storage.js`)
- **目的**：解决 `localStorage` 键名混乱问题
- **使用方法**：
  ```javascript
  import { STORAGE_KEYS, getItem, setItem, hasItem } from '../utils/storage'
  
  // 读取数据
  const value = getItem(STORAGE_KEYS.ACHIEVEMENTS.IDLE, false)
  
  // 写入数据
  setItem(STORAGE_KEYS.ACHIEVEMENTS.IDLE, true)
  
  // 检查存在
  if (hasItem(STORAGE_KEYS.ACHIEVEMENTS.IDLE)) {
    // 已解锁
  }
  ```

### 2. 环境变量配置 (`.env`, `.env.example`)
- **已移除的硬编码敏感信息**：
  - Guestbook 管理员密码
  - SecretQuiz 密钥
  - Supabase URL 和 Key（已支持环境变量）
- **配置方法**：
  1. 复制 `.env.example` 为 `.env`
  2. 填写实际的 Supabase 配置
  3. 设置管理员密码和密钥

### 3. 路由懒加载 (`src/router/index.js`)
- **改进**：所有组件都改为懒加载，提升首屏性能
- **效果**：按需加载组件，减少初始包大小

### 4. 工具函数模块 (`src/utils/helpers.js`)
- **包含的常用函数**：
  - `simpleHash` - 哈希函数（已从 DailyFortune 中抽取）
  - `formatDate` - 日期格式化
  - `randomInt`, `randomColor` - 随机数生成
  - `debounce`, `throttle` - 性能优化函数
  - `deepClone`, `getSafe` - 对象操作
  - `delay`, `generateId` - 实用函数

## 待迁移的组件清单

以下是仍在使用硬编码 `localStorage` 的组件，需要逐步迁移：

### 成就相关组件
1. `Achievement_01.vue` - `achieve_idle`
2. `Achievement_02.vue` - `achieve_02`
3. `Achievement_03.vue` - `achieve_slacking`
4. `Achievement_04.vue` - `achieve_04`
5. `Achievement_05.vue` - `achieve_05`
6. `Achievement_06.vue` - `achieve_06`
7. `HiddenAchievement_01.vue` - `achieve_fate_blessed`

### 其他组件
1. `WhoIAm.vue` - 各种成就检查
2. `SecretRoom.vue` - `hasVisitedSecretRoom`
3. `SecretQuiz.vue` - 成就解锁
4. `RunGame_TheLostRealm.vue` - `story_endings`
5. `RunGameSelector.vue` - 成就和游戏状态
6. `AchievementsStats.vue` - 大量成就检查

## 迁移步骤示例

### 迁移前：
```javascript
// 旧代码
const isUnlocked = localStorage.getItem('achieve_idle') === 'true'
localStorage.setItem('achieve_idle', 'true')
```

### 迁移后：
```javascript
// 新代码
import { STORAGE_KEYS, hasItem, setItem } from '../utils/storage'

const isUnlocked = hasItem(STORAGE_KEYS.ACHIEVEMENTS.IDLE)
setItem(STORAGE_KEYS.ACHIEVEMENTS.IDLE, true)
```

## 已完成的文件

### ✅ 已完成迁移
1. `DailyFortune.vue` - 完整迁移到新存储系统
2. `Guestbook.vue` - 移除硬编码密码，使用环境变量
3. `SecretQuiz.vue` - 移除硬编码密钥，使用环境变量
4. `src/utils/supabase.js` - 使用环境变量配置

## 下一步建议

### 中优先级任务
1. **创建公共组件库**
   - `BaseButton.vue` - 统一按钮样式
   - `BaseCard.vue` - 统一卡片样式
   - `BaseDialog.vue` - 统一弹窗组件

2. **样式重构**
   - 创建 `src/styles/variables.scss` 统一变量
   - 抽取重复的响应式样式

3. **错误处理增强**
   - 添加统一的错误提示组件
   - 增强网络请求错误处理

### 低优先级任务
1. **性能优化**
   - 粒子系统改用 Canvas
   - 图片懒加载
   - 打字机效果优化

2. **用户体验改进**
   - 添加加载状态
   - 改进无障碍支持
   - 添加键盘快捷键

## 注意事项

1. **向后兼容**：新的存储系统会自动检查数据版本，但目前保持原有键名兼容
2. **开发环境**：`.env` 文件已添加到 `.gitignore`，确保敏感信息不提交
3. **构建部署**：生产环境需要配置正确的环境变量
4. **性能监控**：路由懒加载可能需要调整加载策略

## 测试方法

1. **存储系统测试**：
   ```javascript
   // 在浏览器控制台测试
   import { STORAGE_KEYS, getAllAchievementStatus } from './src/utils/storage.js'
   console.log('所有成就状态:', getAllAchievementStatus())
   ```

2. **环境变量测试**：
   ```bash
   # 启动开发服务器前设置环境变量
   npm run serve
   ```

3. **路由懒加载测试**：
   - 检查 Network 面板，确认组件按需加载
   - 测试页面切换时的加载状态

## 紧急回滚

如果新系统出现问题，可以暂时恢复原状：
1. 注释掉新的导入和使用
2. 恢复原有的 `localStorage` 调用
3. 硬编码敏感信息暂时写回原值

---

**迁移状态**：高级优先级修改已完成，基础架构已建立，可以开始逐步迁移其他组件。