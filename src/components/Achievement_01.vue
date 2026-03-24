<template>
  <div class="achievement-01">

    <div class="achievement-header">
      <div class="stars">
        <span v-for="n in 5" :key="n">⭐</span>
      </div>
      <h1 class="achievement-title">🏆 成就解锁！🏆</h1>
      <div class="stars">
        <span v-for="n in 5" :key="n">⭐</span>
      </div>
    </div>

    <div class="achievement-card">
      <div class="card-shine"></div>
      
      <div class="achievement-icon-large">
        <span class="egg-display">{{ eggEmoji }}</span>
      </div>
      
      <div class="achievement-name">
        <span class="achievement-code">Achievement_01</span>
        <h2>闲的蛋疼</h2>
      </div>
      
      <div class="achievement-divider">
        <span>✦</span>
        <span>✦</span>
        <span>✦</span>
      </div>
      
      <div class="achievement-description">
        <p class="congrats">恭喜你获得成就：</p>
        <p class="highlight">闲的蛋疼</p>
      </div>
      
      
      <div class="achievement-reward" @click="eggClick">
        <div class="reward-badge">
          <span class="reward-icon">👋</span>
          <div class="reward-text">
            <p>凭此页截图</p>
            <p>可向作者索要</p>
            <p class="big-slap">一个大逼兜</p>
            <p class="as-reward">作为奖励</p>
          </div>
          <span class="reward-icon">👋</span>
        </div>
      </div>
      
      <div class="achievement-footer">
        <span class="date">{{ currentDate }}</span>
        <span class="signature">—— 闲者认证 · 官方盖章</span>
      </div>
    </div>

    <div class="button-container">
      <router-link to="/" class="return-button">
        <span class="button-icon">🏠</span>
        回到主界面
      </router-link>
      
      <button @click="showScreenshotHint" class="screenshot-button">
        <span class="button-icon">📸</span>
        截图留念
      </button>
    </div>

    <div class="disclaimer">
      <p>* 本成就没有任何实际价值，仅用于证明您确实很闲 *</p>
      <p class="small-text">※ 大逼兜需自提，不包邮 ※</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Achievement_01',
  setup() {
    const router = useRouter()
    const eggCount = ref(0)
    
    const currentDate = computed(() => {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`
    })

    const showScreenshotHint = () => {
      alert('📸 截图已保存至想象中\n（真正的截图请按系统截图键）')
    }

    const eggClick = () => {
      eggCount.value++
      if (eggCount.value === 60) {
        router.push('/who_i_am/achieve_idle/achieve_super_idle')
      }
    }
    
    const eggEmoji = computed(() => {
      if (eggCount.value >= 50) return '💥'
      if (eggCount.value >= 40) return '🔥🔥🍳🔥🔥'
      if (eggCount.value >= 30) return '🔥🍳🔥'
      if (eggCount.value >= 20) return '⚡🥚⚡'
      if (eggCount.value >= 10) return '✨🥚✨'
      if (eggCount.value >= 5) return '🥚'
      return '🥚'
    })

    onMounted(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      localStorage.setItem('achieve_idle', 'true')
    })

    return {
      eggCount,
      eggEmoji,
      currentDate,
      showScreenshotHint,
      eggClick
    }
  }
}
</script>

<style scoped>
.achievement-01 {
  min-height: 100vh;
  background: linear-gradient(145deg, #2a1f3a 0%, #1a0f2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}
.achievement-01::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle at center, 
    rgba(180, 130, 255, 0.15) 0%,
    rgba(140, 90, 255, 0.1) 30%,
    transparent 70%);
  animation: rotate 30s linear infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg) translate(-10%, -10%); }
  to { transform: rotate(360deg) translate(-10%, -10%); }
}
.achievement-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}
.achievement-title {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #b082ff, #8a5aff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(180, 130, 255, 0.3);
}
.stars {
  display: flex;
  gap: 0.3rem;
  font-size: 1.5rem;
  animation: twinkle 2s infinite alternate;
}
@keyframes twinkle {
  from { opacity: 0.5; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1.1); }
}
.achievement-card {
  max-width: 600px;
  width: 100%;
  background: rgba(30, 20, 45, 0.8);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(180, 130, 255, 0.3);
  border-radius: 48px;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8),
              0 0 30px rgba(180, 130, 255, 0.2);
  animation: cardFloat 3s ease-in-out infinite;
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shine 3s infinite;
}
@keyframes shine {
  to { left: 150%; }
}
.achievement-icon-large {
  font-size: 6rem;
  text-align: center;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(180, 130, 255, 0.5));
  animation: bounce 2s infinite;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.egg-display {
  display: inline-block;
  font-size: 4rem;
  transition: all 0.3s ease;
}
@keyframes bounce {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}
.achievement-name {
  text-align: center;
  margin-bottom: 2rem;
}
.achievement-code {
  font-size: 0.9rem;
  color: #b082ff;
  background: #2a1f3a;
  padding: 0.2rem 1rem;
  border-radius: 40px;
  letter-spacing: 1px;
  font-family: monospace;
  display: inline-block;
  margin-bottom: 1rem;
}
.achievement-name h2 {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #fff, #b082ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0.5rem 0;
}
.achievement-divider {
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: #b082ff;
  font-size: 1.2rem;
  margin: 1.5rem 0;
}
.achievement-description {
  text-align: center;
  margin-bottom: 2rem;
}
.congrats {
  font-size: 1.2rem;
  color: #b7cced;
  margin-bottom: 0.5rem;
}
.highlight {
  font-size: 2.5rem;
  color: #b082ff;
  font-weight: bold;
  text-shadow: 0 0 20px rgba(180, 130, 255, 0.5);
  margin: 1rem 0;
}
.achievement-reward {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid #b082ff33;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none
}
.achievement-reward:hover {
  transform: scale(1.02);
  border-color: #b082ff;
}
.reward-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  pointer-events: none;
}
.reward-icon {
  font-size: 3rem;
  animation: wave 2s infinite;
}
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}
.reward-text {
  text-align: center;
  color: #e1e7ef;
}
.reward-text p {
  margin: 0.3rem 0;
}
.big-slap {
  font-size: 2rem;
  color: #ff9b8c;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 155, 140, 0.5);
  margin: 0.5rem 0 !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.as-reward {
  font-size: 1rem;
  color: #b082ff;
  font-style: italic;
}
.achievement-footer {
  display: flex;
  justify-content: space-between;
  color: #506277;
  font-size: 0.9rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px dashed #31465c;
}
.signature {
  font-style: italic;
}
.button-container {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}
.return-button, .screenshot-button {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}
.return-button {
  background: #2a1f3a;
  color: #b082ff;
  border: 1px solid #5a3a8a;
}
.screenshot-button {
  background: linear-gradient(145deg, #3a2f4a, #2a1f3a);
  color: #ff9b8c;
  border: 1px solid #7a4a6a;
}
.return-button:hover {
  background: #3a2f5a;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(180, 130, 255, 0.3);
}
.screenshot-button:hover {
  background: #3a2f4a;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 155, 140, 0.3);
}
.button-icon {
  font-size: 1.2rem;
}
.disclaimer {
  margin-top: 2rem;
  text-align: center;
  color: #506277;
  font-size: 0.8rem;
  position: relative;
  z-index: 1;
}
.small-text {
  font-size: 0.7rem;
  margin-top: 0.3rem;
  color: #5a4a7a;
}
@media (max-width: 600px) {
  .achievement-title {
    font-size: 1.8rem;
  }
  .achievement-name h2 {
    font-size: 2.5rem;
  }
  .highlight {
    font-size: 2rem;
  }
  .reward-badge {
    flex-direction: column;
    gap: 1rem;
  }
  .button-container {
    flex-direction: column;
    width: 100%;
  }
  .return-button, .screenshot-button {
    justify-content: center;
  }
}
</style>