<template>
  <div class="achievements-stats">
    <div v-if="particleCount > 0" class="floating-particles">
      <div v-for="n in particleCount" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
    <div class="stats-header">
      <h1>🏆 成就图鉴 🏆</h1>
      <div class="stats-summary">
        <div class="stat-card">
          <span class="stat-label">已解锁</span>
          <span class="stat-value">{{ unlockedCount }}/{{ totalCount }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">完成度</span>
          <span class="stat-value">{{ completionPercentage }}%</span>
        </div>
      </div>
      <button class="reset-button" @click="resetAchievements" :disabled="isResetting">
        <span class="reset-icon" :class="{ 'spin': isResetting }">🔄</span>
        {{ isResetting ? '重置中...' : '重置成就' }}
      </button>
    </div>

    <div class="achievements-grid">
      <!-- 普通成就（始终显示，未解锁显示问号） -->
      <div v-for="ach in normalAchievements" :key="ach.id" 
           :class="['stats-achievement-card', { unlocked: ach.unlocked }, ach.cardClass]">
        <div class="card-icon">{{ ach.unlocked ? ach.icon : '????' }}</div>
        <div class="card-info">
          <h3>{{ ach.unlocked ? ach.name : '▓▓▓▓▓▓▓▓' }}</h3>
          <p class="achievement-code">{{ ach.unlocked ? ach.code : '??_??' }}</p>
          <p class="achievement-desc">{{ ach.unlocked ? ach.desc : ach.hiddenDesc }}</p>
          <span v-if="ach.unlocked" class="unlocked-badge" :style="{ color: ach.color, background: `${ach.color}20` }">✅ 已解锁</span>
          <span v-else class="locked-badge">❓ 未解锁</span>
        </div>
      </div>

      <!-- 隐藏成就（只显示已解锁的） -->
      <div v-for="ach in unlockedHiddenAchievements" :key="ach.id" 
           :class="['stats-achievement-card unlocked', ach.cardClass]">
        <div class="card-icon">{{ ach.icon }}</div>
        <div class="card-info">
          <h3>{{ ach.name }}</h3>
          <p class="achievement-code">{{ ach.code }}</p>
          <p class="achievement-desc">{{ ach.desc }}</p>
          <span class="unlocked-badge" :style="{ color: '#ffd700', background: 'rgba(255, 215, 0, 0.2)' }">✅ 已解锁</span>
        </div>
      </div>
    </div>
    
    <div class="button-container">
      <router-link to="/" class="return-button">
        <span class="button-icon">🏠</span>回到首页
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AchievementsStats',
  setup() {
    // 普通成就配置（始终显示，未解锁显示问号）
    const normalAchievements = ref([
      { 
        id: 'achieve_idle', name: '闲的蛋疼', code: 'Achievement_01', 
        desc: '在 关于 页面点击按钮50次', icon: '🥚', color: '#b082ff',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 50 ▓▓',
        unlocked: false,
        cardClass: ''
      },
      { 
        id: 'achieve_02', name: '捣蛋专家', code: 'Achievement_02', 
        desc: '在 闲的蛋疼 页面点击大逼兜60次', icon: '💥', color: '#ffd700',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 60 ▓▓',
        unlocked: false,
        cardClass: ''
      },
      { 
        id: 'achieve_03', name: '摸鱼精灵', code: 'Achievement_03', 
        desc: '在 首页 进度和代码行数都小于40时点击施工精灵', icon: '🧚', color: '#50ff80',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓ ▓▓ ▓▓',
        unlocked: false,
        cardClass: ''
      },
      { 
        id: 'achieve_04', name: '最佳损友', code: 'Achievement_04', 
        desc: '答对所有题目，获得损友认证', icon: '🤝', color: '#6ab0ff',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        cardClass: 'best-friend-card'
      },
      { 
        id: 'achieve_05', name: '鸿运当头', code: 'Achievement_05', 
        desc: '首次在运势页面抽到大吉', icon: '🍀', color: '#42b983',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        cardClass: 'lucky-strike-card'
      },
      { 
        id: 'achieve_06', name: '逢凶化吉', code: 'Achievement_06', 
        desc: '首次在运势页面抽到大凶', icon: '⚡', color: '#ff9b8c',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        cardClass: 'turn-the-tide-card'
      }
    ])

    const hiddenAchievements = ref([
      { 
        id: 'achieve_fate_blessed', 
        name: '天命所归', 
        code: 'HIDDEN_01', 
        desc: '集齐所有运势（大吉、吉、小吉、平、小凶、凶、大凶）', 
        icon: '✨', 
        color: '#ffd700',
        cardClass: 'fate-blessed-card'
      }
    ])

    // 更新普通成就的解锁状态
    const updateNormalUnlocked = () => {
      normalAchievements.value.forEach(ach => {
        ach.unlocked = localStorage.getItem(ach.id) === 'true'
      })
    }

    // 获取已解锁的隐藏成就
    const unlockedHiddenAchievements = computed(() => {
      return hiddenAchievements.value.filter(ach => localStorage.getItem(ach.id) === 'true')
    })

    // 总成就数 = 普通成就数 + 已解锁的隐藏成就数
    const totalCount = computed(() => {
      return normalAchievements.value.length + unlockedHiddenAchievements.value.length
    })

    // 已解锁数量 = 普通成就中已解锁数 + 已解锁的隐藏成就数
    const unlockedCount = computed(() => {
      const normalUnlocked = normalAchievements.value.filter(ach => ach.unlocked).length
      return normalUnlocked + unlockedHiddenAchievements.value.length
    })

    const completionPercentage = computed(() => {
      return totalCount.value === 0 ? 0 : Math.floor(unlockedCount.value / totalCount.value * 100)
    })

    const isResetting = ref(false)

    const particleCount = computed(() => {
      return unlockedCount.value * 15
    })

    const getParticleStyle = (n) => {
      const colors = ['#b082ff', '#ffd700', '#50ff80', '#6ab0ff', '#ff9b8c', '#8a6de9', '#00ffff', '#ffa500']
      const size = Math.floor(Math.random() * 8) + 4
      const left = Math.floor(Math.random() * 100)
      const duration = Math.floor(Math.random() * 15) + 8
      const delay = Math.floor(Math.random() * 8)
      const opacity = Math.random() * 0.3 + 0.3
      return {
        width: size + 'px',
        height: size + 'px',
        left: left + '%',
        backgroundColor: colors[n % colors.length],
        opacity: opacity,
        animation: `float ${duration}s linear ${delay}s infinite`,
        filter: 'blur(1px)'
      }
    }

    const resetAchievements = () => {
      if (confirm('确定要重置所有成就进度吗？')) {
        isResetting.value = true
        
        
        normalAchievements.value.forEach(ach => localStorage.removeItem(ach.id))
        
        hiddenAchievements.value.forEach(ach => localStorage.removeItem(ach.id))
        
        updateNormalUnlocked()
        
        hiddenAchievements.value = [...hiddenAchievements.value]
        
        setTimeout(() => {
          isResetting.value = false
        }, 500)
      }
    }
    updateNormalUnlocked()

    return {
      normalAchievements,
      unlockedHiddenAchievements,
      totalCount,
      unlockedCount,
      completionPercentage,
      isResetting,
      particleCount,
      getParticleStyle,
      resetAchievements
    }
  }
}
</script>

<style>
/* 故障乱码效果 */
@keyframes glitch {
  0% {
    transform: translate(0);
    opacity: 1;
    text-shadow: none;
  }
  20% {
    transform: translate(-2px, 2px);
    text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
    opacity: 0.9;
  }
  40% {
    transform: translate(2px, -2px);
    text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
    opacity: 0.8;
  }
  60% {
    transform: translate(-2px, -1px);
    text-shadow: 1px 0 #00ff00, -1px 0 #ff0000;
    opacity: 0.9;
  }
  80% {
    transform: translate(1px, 2px);
    text-shadow: -2px 0 #0000ff, 2px 0 #ffff00;
    opacity: 0.8;
  }
  100% {
    transform: translate(0);
    opacity: 1;
    text-shadow: none;
  }
}

/* 未解锁的成就卡片文字添加故障效果 */
.stats-achievement-card:not(.unlocked) h3,
.stats-achievement-card:not(.unlocked) .achievement-code,
.stats-achievement-card:not(.unlocked) .achievement-desc {
  animation: glitch 0.3s infinite;
  color: #8f9eff;
  filter: blur(0.5px);
  opacity: 0.7;
}

/* 未解锁的图标也加点效果 */
.stats-achievement-card:not(.unlocked) .card-icon {
  filter: grayscale(0.5) blur(0.5px);
  opacity: 0.6;
}

/* 已解锁的成就保持正常 */
.stats-achievement-card.unlocked h3,
.stats-achievement-card.unlocked .achievement-code,
.stats-achievement-card.unlocked .achievement-desc {
  animation: none;
  filter: none;
  opacity: 1;
}

/* 成就04：最佳损友 - 蓝色边框 */
.stats-achievement-card.unlocked.best-friend-card {
  border: 2px solid #6ab0ff;
  box-shadow: 0 0 8px rgba(106, 176, 255, 0.4);
}

/* 成就05：鸿运当头 - 金色边框 */
.stats-achievement-card.unlocked.lucky-strike-card {
  border: 2px solid #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

/* 成就06：逢凶化吉 - 红金色边框 */
.stats-achievement-card.unlocked.turn-the-tide-card {
  border: 2px solid #ff9b8c;
  box-shadow: 0 0 8px rgba(255, 155, 140, 0.4);
}

/* 隐藏成就：天命所归 - 炫彩边框 */
.stats-achievement-card.unlocked.fate-blessed-card {
  position: relative;
  border: 2px solid #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.stats-achievement-card.unlocked.fate-blessed-card::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #42b983, #ffd700);
  background-size: 300% 300%;
  border-radius: 28px;
  z-index: -2;
  animation: borderFlow 3s ease infinite;
  opacity: 0.6;
}

.stats-achievement-card.unlocked.fate-blessed-card .card-info h3,
.stats-achievement-card.unlocked.fate-blessed-card .achievement-code,
.stats-achievement-card.unlocked.fate-blessed-card .achievement-desc {
  color: #ffd700 !important;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.achievements-stats {
  min-height: 100vh;
  background: linear-gradient(145deg, #0a0c0f 0%, #1a1f2a 100%);
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #e1e7ef;
  position: relative;
  overflow: hidden;
}

/* 漂浮粒子容器 */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 单个粒子 */
.particle {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  filter: blur(1px);
  animation: float linear infinite;
  box-shadow: 0 0 10px currentColor;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-120vh) translateX(30px);
    opacity: 0;
  }
}

.stats-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.stats-header h1 {
  font-size: 3rem;
  background: linear-gradient(135deg, #b082ff, #ffd700, #50ff80, #6ab0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  animation: gradientShift 10s ease infinite;
  background-size: 300% 300%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.stats-summary {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(20, 25, 35, 0.8);
  border: 1px solid #31465c;
  border-radius: 20px;
  padding: 1rem 2rem;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #8f9eff;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
}

.reset-button {
  background: #2a1f36;
  color: #ff9b8c;
  border: 1px solid #5c3a48;
  border-radius: 40px;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.reset-button:hover {
  background: #3a2f46;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 155, 140, 0.3);
}

.reset-icon {
  font-size: 1.2rem;
}

.reset-icon.spin {
  animation: spin 0.5s ease-in-out;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.reset-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.achievements-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.stats-achievement-card {
  background: rgba(18, 22, 28, 0.75);
  backdrop-filter: blur(12px);
  border: 2px solid #31465c;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.card-icon {
  font-size: 3rem;
  min-width: 60px;
  text-align: center;
}

.card-info {
  flex: 1;
}

.card-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  color: #e1e7ef;
}

.achievement-code {
  font-size: 0.8rem;
  color: #8f9eff;
  font-family: monospace;
  margin-bottom: 0.5rem;
}

.achievement-desc {
  font-size: 0.9rem;
  color: #b7cced;
  margin-bottom: 1rem;
}

.unlocked-badge {
  font-weight: bold;
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.locked-badge {
  color: #8f9eff;
  font-weight: bold;
  display: inline-block;
  padding: 0.3rem 1rem;
  background: rgba(143, 158, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.return-button {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1f2a36;
  color: #42b983;
  border: 1px solid #31465c;
  transition: all 0.3s ease;
}

.return-button:hover {
  background: #2a3848;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
}

@media (max-width: 600px) {
  .stats-header h1 {
    font-size: 2rem;
  }
  
  .stats-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-achievement-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>