<template>
  <div class="daily-fortune">
    <div class="fortune-container">
      <div class="fortune-header">
        <span class="header-icon">🔮</span>
        <h1>今日运势</h1>
        <span class="header-icon">🔮</span>
      </div>
      
      <div class="fortune-card" :style="{ borderColor: fortuneColor, boxShadow: `0 0 30px ${fortuneColor}40` }">
        <div class="fortune-level" :style="{ color: fortuneColor }">{{ fortuneLevel }}</div>
        <div class="fortune-text">{{ fortuneText }}</div>
        <div class="fortune-date">{{ currentDate }}</div>
        <div class="fortune-tip">✨ 运势每日更新，明天再来看看 ✨</div>
        

      </div>
      
      <div class="button-group">
        <router-link to="/who_i_am" class="back-button">
          <span class="button-icon">←</span>
          返回关于页面
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getItem, setItem, hasItem, STORAGE_KEYS } from '../utils/storage'
import { simpleHash } from '../utils/helpers'

export default {
  name: 'DailyFortune',
  setup() {
    const router = useRouter()
    const fortunes = [
      { text: "万事顺遂，代码一遍过", level: "大吉", color: "#42b983" },
      { text: "思路清晰，Bug绕道走", level: "吉", color: "#6ab0ff" },
      { text: "小有收获，适合摸鱼", level: "小吉", color: "#b0ff80" },
      { text: "平平淡淡，保持现状", level: "平", color: "#8f9eff" },
      { text: "略有不顺，早点下班", level: "小凶", color: "#ffaa66" },
      { text: "小心分号，注意备份", level: "凶", color: "#ff9b8c" },
      { text: "诸事不宜，改天再写", level: "大凶", color: "#ff6b6b" }
    ]
    
    const fortuneText = ref("")
    const fortuneLevel = ref("")
    const fortuneColor = ref("")
    const currentDate = ref("")
    
    // 检测是否集齐所有运势
    const checkAllFortunes = () => {
      const collectedList = getItem(STORAGE_KEYS.FORTUNE.COLLECTED, [])
      
      const currentFortune = fortuneLevel.value
      if (!collectedList.includes(currentFortune)) {
        collectedList.push(currentFortune)
        setItem(STORAGE_KEYS.FORTUNE.COLLECTED, collectedList)
      }
      
      if (collectedList.length === 7 && !hasItem(STORAGE_KEYS.ACHIEVEMENTS.FATE_BLESSED)) {
        setItem(STORAGE_KEYS.ACHIEVEMENTS.FATE_BLESSED, true)
        setTimeout(() => {
          router.push('/who_i_am/fortune/achieve_fate_blessed')
        }, 800)
      }
    }
    

    
    // 获取用户唯一标识（简化快速版）
    const getUserIdentifier = async () => {
      // 快速生成用户标识，避免网络请求卡顿
      const identifiers = []
      
      // 1. 浏览器指纹（快速获取，无网络请求）
      try {
        const fingerprint = [
          navigator.userAgent.substring(0, 30), // 只取前30字符
          screen.width + 'x' + screen.height,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        ].join('|')
        identifiers.push(`fp:${fingerprint}`)
      } catch (e) {
        // 指纹生成失败，静默处理
      }
      
      // 2. 本地存储ID（快速生成）
      let storageId = getItem(STORAGE_KEYS.USER.IDENTIFIER)
      if (!storageId) {
        storageId = 'uid-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
        setItem(STORAGE_KEYS.USER.IDENTIFIER, storageId)
      }
      identifiers.push(`storage:${storageId}`)
      
      // 生成最终的ID（不含时间戳，保持每日固定）
      return identifiers.join('#')
    }
    
    // 生成基于IP和日期的运势
    const generateFortuneFromIPAndDate = async () => {
      const today = new Date()
      const dateStr = today.toISOString().slice(0, 10) // YYYY-MM-DD格式
      currentDate.value = today.toLocaleDateString()
      
      try {
        // 1. 获取用户唯一标识（异步但很快）
        const userIdentifier = await getUserIdentifier()
        
        // 2. 组合种子：用户标识 + 日期
        const seedString = `${userIdentifier}-${dateStr}`
        
        // 3. 生成哈希值
        const hashValue = simpleHash(seedString)
        
        // 4. 映射到7种卦象
        const index = hashValue % fortunes.length
        
        const fortune = fortunes[index]
        fortuneText.value = fortune.text
        fortuneLevel.value = fortune.level
        fortuneColor.value = fortune.color
        
        // 检查成就解锁
        if (fortune.level === "大吉") {
          if (!hasItem(STORAGE_KEYS.ACHIEVEMENTS.LUCKY_STRIKE)) {
            setItem(STORAGE_KEYS.ACHIEVEMENTS.LUCKY_STRIKE, true)
            setTimeout(() => {
              router.push('/who_i_am/fortune/achieve_lucky_strike')
            }, 800)
          }
        } else if (fortune.level === "大凶") {
          if (!hasItem(STORAGE_KEYS.ACHIEVEMENTS.TURN_TIDE)) {
            setItem(STORAGE_KEYS.ACHIEVEMENTS.TURN_TIDE, true)
            setTimeout(() => {
              router.push('/who_i_am/fortune/achieve_turn_the_tide')
            }, 800)
          }
        }
        
        // 检测集齐所有运势
        checkAllFortunes()
        
      } catch (error) {
        // 生成失败，使用备用方案
        // 备用方案：使用日期哈希
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
        const index = dayOfYear % fortunes.length
        const fortune = fortunes[index]
        fortuneText.value = fortune.text
        fortuneLevel.value = fortune.level
        fortuneColor.value = fortune.color
      }
    }
    

    
    const getDailyFortune = () => {
      generateFortuneFromIPAndDate()
    }
    
    onMounted(() => {
      getDailyFortune()
    })
    
    return {
      fortuneText,
      fortuneLevel,
      fortuneColor,
      currentDate
    }
  }
}
</script>

<style scoped>
.daily-fortune {
  min-height: 100vh;
  background: linear-gradient(145deg, var(--app-page-gradient-start), var(--app-page-gradient-end));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  transition: background var(--app-transition);
}
.fortune-container {
  max-width: 500px;
  width: 100%;
  text-align: center;
}
.fortune-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.header-icon {
  font-size: 2rem;
}
.fortune-header h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.fortune-card {
  background: var(--app-container-bg);
  backdrop-filter: blur(12px);
  border: 2px solid #ff69b4;
  border-radius: 48px;
  padding: 3rem 2rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.fortune-level {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}
.fortune-text {
  font-size: 1.5rem;
  color: var(--app-text);
  margin-bottom: 2rem;
  line-height: 1.6;
}
.fortune-date {
  font-size: 0.9rem;
  color: var(--app-accent-text);
  margin-bottom: 1rem;
}
.fortune-tip {
  font-size: 0.8rem;
  color: var(--app-text-muted);
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--app-divider);
}
.button-group {
  margin-top: 2rem;
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: var(--app-btn-secondary-bg);
  color: var(--app-accent-green-text);
  text-decoration: none;
  border-radius: 40px;
  font-size: 1rem;
  border: 1px solid var(--app-divider);
  transition: all 0.3s ease;
}
.back-button:hover {
  background: var(--app-btn-secondary-hover);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
}
.button-icon {
  font-size: 1.2rem;
}



@media (max-width: 600px) {
  .fortune-header h1 { font-size: 1.5rem; }
  .header-icon { font-size: 1.5rem; }
  .fortune-level { font-size: 2rem; }
  .fortune-text { font-size: 1.1rem; }
  .fortune-card { padding: 2rem 1rem; }
}
</style>