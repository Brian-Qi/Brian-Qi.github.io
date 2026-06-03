<template>
  <div class="hidden-achievement music-lover">
    <div class="achievement-header">
      <div class="stars"><span v-for="n in 5" :key="n">⭐</span></div>
      <h1 class="achievement-title">🏆 隐藏成就解锁！🏆</h1>
      <div class="stars"><span v-for="n in 5" :key="n">⭐</span></div>
    </div>
    <div class="achievement-card">
      <div class="card-shine"></div>
      <div class="achievement-icon-large">🔁</div>
      <div class="achievement-name">
        <span class="achievement-code">Hidden_Achievement_02</span>
        <h2 class="colorful-title">回到起点</h2>
      </div>
      <div class="achievement-divider"><span>✦</span><span>✦</span><span>✦</span></div>
      <div class="achievement-description">
        <p class="congrats">恭喜你获得隐藏成就：</p>
        <p class="highlight colorful-title">回到起点</p>
      </div>
      <div class="achievement-reward">
        <div class="reward-badge">
          <div class="music-colors">
            <span class="music-tag" style="background: #FFFFFF; color: #333">🔁</span>
            <span class="music-tag" style="background: #4DC9F6">🎵</span>
            <span class="music-tag" style="background: #C084FC">🌙</span>
          </div>
          <div class="reward-text">
            <p>发现本不该存在的首页</p>
            <p class="big-slap colorful-text">并在此停下脚步</p>
            <p>当一个故事快要结束的时候，我们总会想起她的开始</p>
          </div>
        </div>
      </div>
      <div class="achievement-footer">
        <span class="date">{{ currentDate }}</span>
        <span class="signature">—— 曲终人散 · 黄粱一梦</span>
      </div>
    </div>
    <div class="button-container">
      <router-link to="/" class="return-button"><span class="button-icon">↩️</span>返回首页</router-link>
    </div>
    <div class="disclaimer">
      <p>* 不是所有人都愿意停下，听一首歌 *</p>
      <p class="small-text">※ Da Capo — 为世间一切美好而战 ※</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
export default {
  name: 'HiddenAchievement_02',
  setup() {
    const currentDate = computed(() => {
      const date = new Date()
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    })
    onMounted(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      localStorage.setItem('achieve_music_lover', 'true')
    })
    return { currentDate }
  }
}
</script>

<style scoped>
.hidden-achievement {
  min-height: 100vh;
  background: linear-gradient(145deg, var(--app-bg) 0%, var(--app-page-gradient-start) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
  transition: background var(--app-transition);
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
  background: linear-gradient(135deg, #FFFFFF, #4DC9F6, #C084FC, #FFFFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: titleFlow 5s ease infinite;
}

.colorful-text {
  background: linear-gradient(135deg, #FFFFFF, #4DC9F6, #C084FC, #FFFFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: titleFlow 5s ease infinite;
}

.colorful-title {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #FFFFFF, #4DC9F6, #C084FC, #FFFFFF);
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
  background: var(--app-container-bg);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(192, 132, 252, 0.3);
  border-radius: 48px;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8),
              0 0 30px rgba(192, 132, 252, 0.2);
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
  filter: drop-shadow(0 0 20px rgba(192, 132, 252, 0.5));
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
  color: var(--app-accent-text);
  background: var(--app-btn-secondary-bg);
  padding: 0.2rem 1rem;
  border-radius: 40px;
  letter-spacing: 1px;
  font-family: monospace;
  display: inline-block;
  margin-bottom: 1rem;
}

.achievement-name h2 {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #FFFFFF, #4DC9F6, #C084FC, #FFFFFF);
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
  color: #C084FC;
  font-size: 1.2rem;
  margin: 1.5rem 0;
}

.achievement-description {
  text-align: center;
  margin-bottom: 2rem;
}

.congrats {
  font-size: 1.2rem;
  color: var(--app-fun-text);
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
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.reward-badge {
  text-align: center;
}

.music-colors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.music-tag {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);
  animation: pulseTag 2s ease-in-out infinite;
}

.music-tag:nth-child(2) {
  animation-delay: 0.3s;
}

.music-tag:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes pulseTag {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.reward-text {
  text-align: center;
  color: var(--app-text);
}

.reward-text p {
  margin: 0.3rem 0;
}

.big-slap {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0 !important;
}

.achievement-footer {
  display: flex;
  justify-content: space-between;
  color: var(--app-text-muted);
  font-size: 0.9rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--app-divider);
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
  background: var(--app-btn-secondary-bg);
  color: #C084FC;
  border: 1px solid var(--app-divider);
  cursor: pointer;
}

.return-button:hover {
  background: var(--app-btn-secondary-hover);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(192, 132, 252, 0.3);
}

.button-icon {
  font-size: 1.2rem;
}

.disclaimer {
  margin-top: 2rem;
  text-align: center;
  color: var(--app-text-muted);
  font-size: 0.8rem;
  position: relative;
  z-index: 1;
}

.small-text {
  font-size: 0.7rem;
  margin-top: 0.3rem;
  color: var(--app-text-muted);
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
  .music-tag {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }
  .big-slap {
    font-size: 1.5rem;
  }
}
</style>
