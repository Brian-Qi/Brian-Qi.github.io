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
    
    <p>更多功能  敬请期待</p>
    
    <router-link to="/" class="back-link">
      <span class="button-icon">←</span>
      返回首页
    </router-link>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'SecretRoom',
  setup() {
    onMounted(() => {
      localStorage.setItem('hasVisitedSecretRoom', 'true')
    })
    
    return {}
  }
}
</script>

<style scoped>
.secret-room {
  min-height: 100vh;
  background: linear-gradient(145deg, #2a1f2a, #1a1f2a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e1e7ef;
  font-family: 'Inter', sans-serif;
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

.run-game-button {
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
  margin-bottom: 1rem;
}

.run-game-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.6);
}

.button-icon {
  font-size: 1.3rem;
}

p {
  font-size: 1.2rem;
  color: #b7cced;
  margin-bottom: 2rem;
}

.back-link {
  color: #42b983;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #31465c;
  border-radius: 40px;
  background: #1f2a36;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link:hover {
  background: #2a3848;
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