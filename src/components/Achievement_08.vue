<template>
  <div class="achievement-08">
    <div class="achievement-header">
      <div class="stars"><span v-for="n in 5" :key="n">⭐</span></div>
      <h1 class="achievement-title">🏆 成就解锁！🏆</h1>
      <div class="stars"><span v-for="n in 5" :key="n">⭐</span></div>
    </div>
    <div class="achievement-card">
      <div class="card-shine"></div>
      <div class="achievement-icon-large">🌓</div>
      <div class="achievement-name">
        <span class="achievement-code">Achievement_08</span>
        <h2>光影穿梭</h2>
      </div>
      <div class="achievement-divider"><span>✦</span><span>✦</span><span>✦</span></div>
      <div class="achievement-description">
        <p class="congrats">恭喜你获得成就：</p>
        <p class="highlight">光影穿梭</p>
      </div>
      <div class="achievement-reward">
        <div class="reward-badge">
          <span class="reward-icon">☀️</span>
          <div class="reward-text">
            <p>光与暗的交界</p>
            <p>都是你的领地</p>
            <p class="big-slap">来回横跳20次</p>
            <p class="as-reward">白天不懂夜的黑？你懂</p>
          </div>
          <span class="reward-icon">🌙</span>
        </div>
      </div>
      <div class="achievement-footer">
        <span class="date">{{ currentDate }}</span>
        <span class="signature">—— 光影行者认证 · 官方认证</span>
      </div>
    </div>
    <div class="button-container">
      <router-link to="/achievements" class="return-button"><span class="button-icon">🏠</span>返回成就</router-link>
    </div>
    <div class="disclaimer"><p>* 光明与黑暗，各有各的魅力 *</p><p class="small-text">※ 来回切，不累吗？ ※</p></div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'

export default {
  name: 'Achievement_08',
  setup() {
    const currentDate = computed(() => {
      const date = new Date()
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    })
    onMounted(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    return { currentDate }
  }
}
</script>

<style scoped>
.achievement-08 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.achievement-08::before {
  content: '';
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  z-index: -1;
}

[data-theme="light"] .achievement-08::before {
  background: linear-gradient(135deg, #fff8e7 0%, #ffecd2 50%, #fcb69f 100%);
}

.achievement-header {
  text-align: center;
  margin-bottom: 2rem;
  z-index: 1;
}

.stars {
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  margin: 0.5rem 0;
}

.stars span {
  display: inline-block;
  animation: starPulse 2s ease infinite;
}

.stars span:nth-child(1) { animation-delay: 0s; }
.stars span:nth-child(2) { animation-delay: 0.2s; }
.stars span:nth-child(3) { animation-delay: 0.4s; }
.stars span:nth-child(4) { animation-delay: 0.6s; }
.stars span:nth-child(5) { animation-delay: 0.8s; }

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.achievement-title {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #ffd700, #ff8c00, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 1rem 0;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid #f5a623;
  border-radius: 48px;
  padding: 3rem 2.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 60px -20px rgba(0,0,0,0.5),
              0 0 40px rgba(245, 166, 35, 0.2);
  overflow: hidden;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(245, 166, 35, 0.1) 0%, transparent 70%);
  animation: cardShine 6s linear infinite;
}

@keyframes cardShine {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.achievement-icon-large {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 20px rgba(245, 166, 35, 0.5));
  animation: iconFloat 3s ease infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.achievement-name {
  margin-bottom: 1.5rem;
}

.achievement-code {
  display: inline-block;
  background: rgba(245, 166, 35, 0.15);
  color: #f5a623;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  margin-bottom: 0.5rem;
}

.achievement-name h2 {
  font-size: 2.8rem;
  background: linear-gradient(135deg, #ffd700, #f5a623, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0.5rem 0;
}

.achievement-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #f5a623;
  font-size: 1rem;
  margin: 1.5rem 0;
}

.achievement-description {
  margin: 1.5rem 0;
}

.congrats {
  color: #aaa;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.highlight {
  color: #f5a623;
  font-size: 1.8rem;
  font-weight: bold;
}

.achievement-reward {
  margin: 2rem 0;
}

.reward-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: rgba(245, 166, 35, 0.08);
  border: 1px solid rgba(245, 166, 35, 0.2);
  border-radius: 24px;
  padding: 1.5rem;
}

.reward-icon {
  font-size: 2.5rem;
  animation: rewardPulse 2s ease infinite;
}

@keyframes rewardPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.reward-text {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.8;
}

.reward-text .big-slap {
  font-size: 1.3rem;
  color: #f5a623;
  font-weight: bold;
  margin: 0.3rem 0;
}

.reward-text .as-reward {
  color: #aaa;
  font-size: 0.9rem;
  font-style: italic;
}

.achievement-footer {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.date {
  color: #888;
  font-size: 0.85rem;
}

.signature {
  color: #666;
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
}

.button-container {
  margin-top: 2rem;
  z-index: 1;
}

.return-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: #f5a623;
  border: 1px solid rgba(245, 166, 35, 0.3);
  padding: 0.8rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.return-button:hover {
  background: rgba(245, 166, 35, 0.15);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(245, 166, 35, 0.3);
}

.button-icon {
  font-size: 1.2rem;
}

.disclaimer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 0.85rem;
  z-index: 1;
}

.disclaimer .small-text {
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
