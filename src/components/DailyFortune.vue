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
      const allFortunes = ['大吉', '吉', '小吉', '平', '小凶', '凶', '大凶']
      const collected = localStorage.getItem('collected_fortunes')
      const collectedList = collected ? JSON.parse(collected) : []
      
      const currentFortune = fortuneLevel.value
      if (!collectedList.includes(currentFortune)) {
        collectedList.push(currentFortune)
        localStorage.setItem('collected_fortunes', JSON.stringify(collectedList))
      }
      
      if (collectedList.length === 7 && !localStorage.getItem('achieve_fate_blessed')) {
        localStorage.setItem('achieve_fate_blessed', 'true')
        setTimeout(() => {
          router.push('/who_i_am/fortune/achieve_fate_blessed')
        }, 800)
      }
    }
    
    const getDailyFortune = () => {
      const today = new Date()
      const dateStr = today.toLocaleDateString()
      currentDate.value = dateStr
      
      // 获取或生成用户的唯一种子
      let userSeed = localStorage.getItem('user_fortune_seed')
      if (!userSeed) {
        userSeed = Math.floor(Math.random() * 1000000)
        localStorage.setItem('user_fortune_seed', userSeed)
      }
      
      // 用日期 + 用户种子 计算运势索引
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
      const hash = (dayOfYear * userSeed) % fortunes.length
      const index = Math.abs(hash) % fortunes.length
      
      const fortune = fortunes[index]
      fortuneText.value = fortune.text
      fortuneLevel.value = fortune.level
      fortuneColor.value = fortune.color
      
      // 检查成就解锁
      if (fortune.level === "大吉") {
        if (!localStorage.getItem('achieve_05')) {
          localStorage.setItem('achieve_05', 'true')
          setTimeout(() => {
            router.push('/who_i_am/fortune/achieve_lucky_strike')
          }, 800)
        }
      } else if (fortune.level === "大凶") {
        if (!localStorage.getItem('achieve_06')) {
          localStorage.setItem('achieve_06', 'true')
          setTimeout(() => {
            router.push('/who_i_am/fortune/achieve_turn_the_tide')
          }, 800)
        }
      }
      
      // 检测集齐所有运势
      checkAllFortunes()
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
  background: linear-gradient(145deg, #1a1f2a, #2a1f2a);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
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
  background: rgba(20, 25, 35, 0.9);
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
  color: #e1e7ef;
  margin-bottom: 2rem;
  line-height: 1.6;
}
.fortune-date {
  font-size: 0.9rem;
  color: #8f9eff;
  margin-bottom: 1rem;
}
.fortune-tip {
  font-size: 0.8rem;
  color: #506277;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed #31465c;
}
.button-group {
  margin-top: 2rem;
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: #1f2a36;
  color: #42b983;
  text-decoration: none;
  border-radius: 40px;
  font-size: 1rem;
  border: 1px solid #31465c;
  transition: all 0.3s ease;
}
.back-button:hover {
  background: #2a3848;
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