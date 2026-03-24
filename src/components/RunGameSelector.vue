<template>
  <div class="run-game-selector">
    <div class="selector-container">
      <h1>🎲 单人跑团 🎲</h1>
      <p class="subtitle">选择你的冒险</p>
      
      <div class="story-list">
        <!-- 精简版：遗落之境 -->
        <div class="story-card" @click="selectStory('basic')">
          <div class="story-icon">🌊</div>
          <div class="story-info">
            <h3>遗落之境</h3>
            <p>你在灰色的海滩醒来，失去记忆。探索这片遗忘之地，找回自己。</p>
            <div class="story-meta">
              <span>🎭 5个结局</span>
              <span>⏱️ 5-8分钟</span>
            </div>
            <div class="progress" v-if="basicProgress > 0">
              📖 已解锁 {{ basicProgress }}/3 个结局
            </div>
            <div v-if="basicUnlocked" class="badge">✅ 完整版已解锁</div>
          </div>
        </div>
        
        <!-- 占位：更多剧本 -->
        <div class="story-card coming-soon">
          <div class="story-icon">🔒</div>
          <div class="story-info">
            <h3>???</h3>
            <p>即将到来</p>
          </div>
        </div>
      </div>
      
      <div class="button-container">
        <router-link to="/who_i_am/secret_quiz/secret_room" class="back-button">
          <span class="button-icon">←</span>
          返回秘密空间
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RunGameSelector',
  setup() {
    const router = useRouter()
    const basicEndings = ref([])
    
    const basicProgress = computed(() => basicEndings.value.length)
    const basicUnlocked = computed(() => basicEndings.value.length >= 3)
    
    const selectStory = (story) => {
      if (story === 'basic') {
        router.push('/who_i_am/secret_quiz/secret_room/run_game/the_lost_realm')
      }
    }
    
    onMounted(() => {
      const saved = localStorage.getItem('story_endings')
      if (saved) {
        basicEndings.value = JSON.parse(saved)
      }
    })
    
    return {
      basicProgress,
      basicUnlocked,
      selectStory
    }
  }
}
</script>

<style scoped>
.run-game-selector {
  min-height: 100vh;
  background: linear-gradient(145deg, #1a1f2a, #2a1f2a);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.selector-container {
  max-width: 600px;
  width: 100%;
  background: rgba(20, 25, 35, 0.9);
  backdrop-filter: blur(12px);
  border: 2px solid #ff69b4;
  border-radius: 32px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
}

h1 {
  font-size: 2rem;
  color: #ff69b4;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #8f9eff;
  margin-bottom: 2rem;
}

.story-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.story-card {
  display: flex;
  gap: 1rem;
  padding: 1.2rem;
  background: #1f2a36;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #31465c;
}

.story-card:not(.coming-soon):hover {
  transform: translateX(5px);
  border-color: #ff69b4;
  background: #2a3848;
}

.story-card.coming-soon {
  opacity: 0.5;
  cursor: not-allowed;
}

.story-icon {
  font-size: 3rem;
  min-width: 60px;
  text-align: center;
}

.story-info h3 {
  font-size: 1.2rem;
  color: #e1e7ef;
  margin-bottom: 0.3rem;
}

.story-info p {
  font-size: 0.85rem;
  color: #b7cced;
  margin-bottom: 0.5rem;
}

.story-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #8f9eff;
  margin-bottom: 0.3rem;
}

.progress {
  font-size: 0.75rem;
  color: #42b983;
  margin-top: 0.2rem;
}

.badge {
  display: inline-block;
  background: #ff69b4;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  margin-top: 0.3rem;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.back-button {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a2f4a;
  color: #6ab0ff;
  border: 1px solid #3a6a9a;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #2a4a6a;
  transform: scale(1.05);
}
</style>