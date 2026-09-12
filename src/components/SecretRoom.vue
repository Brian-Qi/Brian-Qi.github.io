<template>
  <div class="secret-room">
    <h1>🔮 秘密房间 🔮</h1>
    
    <!-- 留言墙入口 -->
    <div class="guestbook-section">
      <router-link to="/guestbook" class="guestbook-button">
        <span class="button-icon">📝</span>
        前往留言墙
      </router-link>
    </div>
    
    <router-link to="/who_i_am/secret_quiz/secret_room/run_game" class="run-game-button">
      <span class="button-icon">🎲</span>
      单人跑团
    </router-link>
    
    <button class="arg-button" @click="showArg = true">
      <span class="button-icon">📜</span>
      ARG
    </button>
    
    <p>更多功能  敬请期待</p>
    
    <router-link to="/" class="back-link">
      <span class="button-icon">←</span>
      返回首页
    </router-link>
    
    <!-- ARG 入口弹窗 -->
    <div v-if="showArg" class="arg-modal" @click.self="showArg = false">
      <div class="arg-modal-box">
        <button class="arg-modal-close" @click="showArg = false">×</button>
        <a href="/arg_01/" class="arg-card">
          <div class="arg-card-icon">📜</div>
          <div class="arg-card-info">
            <h3>第五张财签</h3>
            <p>一桩民国旧案的民俗解谜。五路人名、一栋沈宅、几页说不清的账——翻完它。</p>
            <div class="arg-card-meta">
              <span>🔍 民俗解谜</span>
              <span>⏱️ 约 30 分钟</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'SecretRoom',
  setup() {
    const showArg = ref(false)

    onMounted(() => {
      localStorage.setItem('hasVisitedSecretRoom', 'true')
    })
    
    return { showArg }
  }
}
</script>

<style scoped>
.secret-room {
  min-height: 100vh;
  background: linear-gradient(145deg, var(--app-page-gradient-end), var(--app-page-gradient-start));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--app-text);
  font-family: 'Inter', sans-serif;
  transition: background var(--app-transition), color var(--app-transition);
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.guestbook-section {
  margin-bottom: 1rem;
}

.guestbook-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: white;
  text-decoration: none;
  border-radius: 40px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
}

.guestbook-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.6);
}

.run-game-button,
.arg-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 40px;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
  margin-bottom: 1rem;
}

.run-game-button:hover,
.arg-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.6);
}

.arg-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: min(420px, 90vw);
  padding: 1.1rem 1.4rem;
  margin-bottom: 1rem;
  text-align: left;
  text-decoration: none;
  border-radius: 24px;
  background: var(--app-btn-secondary-bg);
  border: 1px solid var(--app-divider);
  transition: all 0.3s ease;
}

.arg-card:hover {
  transform: translateY(-2px);
  border-color: #ff69b4;
  background: var(--app-btn-secondary-hover);
  box-shadow: 0 0 24px rgba(255, 105, 180, 0.3);
}

.arg-card-icon {
  font-size: 2.4rem;
  min-width: 48px;
  text-align: center;
  filter: drop-shadow(0 0 6px rgba(255, 105, 180, 0.4));
}

.arg-card-info h3 {
  font-size: 1.15rem;
  color: var(--app-text);
  margin-bottom: 0.25rem;
}

.arg-card-info p {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--app-fun-text);
  margin-bottom: 0.5rem;
}

.arg-card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--app-accent-text);
}

.arg-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.arg-modal-box {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 1.4rem 1.2rem 1.2rem;
  background: var(--app-container-bg, rgba(18, 22, 28, 0.95));
  border: 1px solid var(--app-divider);
  border-radius: 28px;
  box-shadow: 0 0 40px rgba(255, 105, 180, 0.25);
  animation: argPop 0.25s ease;
}

.arg-modal .arg-card {
  width: 100%;
  margin-bottom: 0;
}

.arg-modal-close {
  position: absolute;
  top: 0.4rem;
  right: 0.8rem;
  background: none;
  border: none;
  color: var(--app-fun-text);
  font-size: 1.7rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;
}

.arg-modal-close:hover {
  color: #ff69b4;
}

@keyframes argPop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.button-icon {
  font-size: 1.3rem;
}

p {
  font-size: 1.2rem;
  color: var(--app-fun-text);
  margin-bottom: 2rem;
}

.back-link {
  color: var(--app-accent-green-text);
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--app-divider);
  border-radius: 40px;
  background: var(--app-btn-secondary-bg);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link:hover {
  background: var(--app-btn-secondary-hover);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
  
  .guestbook-button, .run-game-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>