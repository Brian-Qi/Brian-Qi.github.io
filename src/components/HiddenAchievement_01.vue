<template>
  <div class="hidden-achievement fate-blessed">
    <div class="achievement-header">
      <div class="stars"><span v-for="n in 5" :key="n">⭐</span></div>
      <h1 class="achievement-title">🏆 隐藏成就解锁！🏆</h1>
      <div class="stars"><span v-for="n in 5" :key="n">⭐</span></div>
    </div>
    <div class="achievement-card">
      <div class="card-shine"></div>
      <div class="achievement-icon-large">✨</div>
      <div class="achievement-name">
        <span class="achievement-code">Hidden_Achievement_01</span>
        <h2 class="colorful-title">天命所归</h2>
      </div>
      <div class="achievement-divider"><span>✦</span><span>✦</span><span>✦</span></div>
      <div class="achievement-description">
        <p class="congrats">恭喜你获得隐藏成就：</p>
        <p class="highlight colorful-title">天命所归</p>
      </div>
      <div class="achievement-reward">
        <div class="reward-badge">
          <div class="fortune-colors">
            <span v-for="(item, i) in fortunesList" :key="i" class="fortune-tag" :style="{ background: item.color }">{{ item.name }}</span>
          </div>
          <div class="reward-text">
            <p>集齐七种运势</p>
            <p class="big-slap colorful-text">吉凶祸福，尽在掌握 ✨</p>
            <p>七种运势，天命所归</p>
          </div>
        </div>
      </div>
      <div class="achievement-footer">
        <span class="date">{{ currentDate }}</span>
        <span class="signature">—— 命运之轮 · 神选之人</span>
      </div>
    </div>
    <div class="button-container">
      <router-link to="/who_i_am/fortune" class="return-button"><span class="button-icon">❌</span>关闭界面</router-link>
    </div>
    <div class="disclaimer">
      <p>* 能集齐所有运势，已是天选之人 *</p>
      <p class="small-text">※ 命运掌握在自己手中 ※</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
export default {
  name: 'HiddenAchievement_01',
  setup() {
    const currentDate = computed(() => {
      const date = new Date()
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    })
    const fortunesList = [
      { name: '大吉', color: '#ffd700' },
      { name: '吉', color: '#42b983' },
      { name: '小吉', color: '#b0ff80' },
      { name: '平', color: '#8f9eff' },
      { name: '小凶', color: '#ffaa66' },
      { name: '凶', color: '#ff9b8c' },
      { name: '大凶', color: '#ff6b6b' }
    ]
    onMounted(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      localStorage.setItem('achieve_fate_blessed', 'true')
    })
    return { currentDate, fortunesList }
  }
}
</script>

<style scoped>
.hidden-achievement {
  min-height: 100vh;
  background: linear-gradient(145deg, #0a0c0f 0%, #1a1f2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
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
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #42b983, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: titleFlow 5s ease infinite;
}

.colorful-text {
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #42b983, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: titleFlow 5s ease infinite;
}

.colorful-title {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #42b983, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: titleFlow 5s ease infinite;
  margin: 0.5rem 0;
}

@keyframes titleFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
  background: rgba(20, 25, 35, 0.8);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 48px;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8),
              0 0 30px rgba(255, 215, 0, 0.2);
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
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  animation: bounce 2s infinite;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: #8f9eff;
  background: #1f2a36;
  padding: 0.2rem 1rem;
  border-radius: 40px;
  letter-spacing: 1px;
  font-family: monospace;
  display: inline-block;
  margin-bottom: 1rem;
}

.achievement-name h2 {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #ffd700, #ff6b6b, #42b983, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: titleFlow 5s ease infinite;
  margin: 0.5rem 0;
}

.achievement-divider {
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: #ffd700;
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
  font-weight: bold;
  margin: 1rem 0;
}

.achievement-reward {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid #ffd70033;
}

.reward-badge {
  text-align: center;
}

.fortune-colors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.fortune-tag {
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
  box-shadow: 0 0 10px currentColor;
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
  font-weight: bold;
  margin: 0.5rem 0 !important;
}

.as-reward {
  font-size: 1rem;
  color: #8f9eff;
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

.return-button {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  background: #1f2a36;
  color: #42b983;
  border: 1px solid #31465c;
  cursor: pointer;
}

.return-button:hover {
  background: #2a3848;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
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
  color: #3c536b;
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
  .return-button {
    justify-content: center;
  }
  .fortune-tag {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }
  .big-slap {
    font-size: 1.5rem;
  }
}
</style>