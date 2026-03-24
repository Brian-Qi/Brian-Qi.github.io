<template>
  <div class="who-am">
    <h1>-------< 关于 Briandolph Qi >-------</h1>
    
    <!-- 搞个自嘲的头部 -->
    <div class="profile-header">
      <span class="status-badge">🛠️ 调试模式 ON</span>
      <span class="status-badge">🧪 实验性人类</span>
    </div>

    <!-- 自我介绍可以皮一下 -->
    <div class="bio-card">
      <h2>🔍 当前身份</h2>
      <ul>
        <li>💻 职业：<span class="highlight">代码缝补匠</span>（自称）</li>
        <li>🌙 夜间活动：<span class="highlight">与Bug搏斗</span>（胜率约 30%）</li>
        <li>☕ 生命体征维持：<span class="highlight">咖啡因 5.0</span></li>
        <li>🎯 天赋技能：<span class="highlight">Ctrl+C / Ctrl+V 精通</span></li>
      </ul>
    </div>

    <!-- 项目状态可以玩梗 -->
    <div class="project-card">
      <h2>🚀 当前项目状态</h2>
      <div class="project-line">
        <span>这个网站</span>
        <span class="progress-tag">✨ 80% 摸鱼，20% 写代码</span>
      </div>
      <div class="project-line">
        <span>下一个大项目</span>
        <span class="progress-tag">🤔 还在想</span>
      </div>
      <div class="project-line">
        <span>技术栈</span>
        <span class="progress-tag">Vue + 咖啡 + 玄学</span>
      </div>
    </div>

    <!-- 搞个无厘头的技能进度条 -->
    <div class="skills-card">
      <h2>📊 不靠谱能力图鉴</h2>
      <div class="skill-item">
        <span>写Bug</span>
        <div class="skill-bar"><div class="skill-fill" style="width: 98%">98%</div></div>
      </div>
      <div class="skill-item">
        <span>修Bug</span>
        <div class="skill-bar"><div class="skill-fill" style="width: 30%">30%</div></div>
      </div>
      <div class="skill-item">
        <span>找Bug</span>
        <div class="skill-bar"><div class="skill-fill" style="width: 5%">5%</div></div>
      </div>
      <div class="skill-item">
        <span>假装懂CSS</span>
        <div class="skill-bar"><div class="skill-fill" style="width: 70%">70%</div></div>
      </div>
    </div>

    <!-- 彩蛋区 -->
    <div class="easter-eggs">
      <h2>🥚 彩蛋区</h2>
      <!-- 今日运势（第一个，统一格式） -->
      <div class="egg-item" @click="goToFortune">
        <span>🔮 今日运势</span>
        <span class="secret-message" style="margin-left: auto;">点击查看 →</span>
      </div>
      <div class="egg-item" @click="handleEggClick">
        <span>🔨 点击次数：{{ eggCount }}</span>
        <span v-if="eggCount >= 50" class="secret-message" style="margin-left: auto;"> 🎉 成就达成！</span>
        <span v-else-if="eggCount > 40" class="secret-message" style="margin-left: auto;"> 好吧你赢了 🏆</span>
        <span v-else-if="eggCount > 30" class="secret-message" style="margin-left: auto;"> 够啦！(╯°□°)╯ ︵ ┻━┻</span>
        <span v-else-if="eggCount > 20" class="secret-message" style="margin-left: auto;"> 给你闲的(*￣︿￣)</span>
        <span v-else-if="eggCount > 10" class="secret-message" style="margin-left: auto;"> 你还真点啊？</span>
      </div>
      <div class="egg-item" @click="handleSecretClick">
        <span>🤫 秘密按钮</span>
        <span v-if="hasVisitedSecretRoom" class="secret-message" style="margin-left: auto;"> 🔓 已解锁，点击进入</span>
        <span v-else-if="showSecret" class="secret-message" style="margin-left: auto;"> 并没有什么秘密</span>
      </div>
    </div>

    <!-- 施工中的友情提示 -->
    <div class="construction-note">
      <span class="glow-dot"></span>
      <span>本页面仍在施工，内容会随机刷新</span>
      <span class="glow-dot"></span>
    </div>

    <div class="button-container">
      <router-link to="/" class="back-link">
        <span class="button-icon">🏠</span>
        回到首页
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'WhoIAm',
  setup() {
    const router = useRouter()
    const eggCount = ref(0)
    const showSecret = ref(false)
    const secretClickCount = ref(0)
    const hasVisitedSecretRoom = ref(localStorage.getItem('hasVisitedSecretRoom') === 'true')
    
    const handleEggClick = () => {
      eggCount.value++
      if (eggCount.value === 50) {
        router.push('/who_i_am/achieve_idle')
      } else if (eggCount.value === 60) {
        router.push('/who_i_am/achieve_02')
      }
    }
    
    const goToFortune = () => {
      router.push('/who_i_am/fortune')
    }

    const handleSecretClick = () => {
      // 检查是否已经解锁过秘密空间
      if (hasVisitedSecretRoom.value) {
        router.push('/who_i_am/secret_quiz')
        return
      }
      
      // 第一次访问的逻辑
      secretClickCount.value++
      showSecret.value = !showSecret.value
      
      if (secretClickCount.value >= 20) {
        router.push('/who_i_am/secret_quiz')
      }
    }
    
    return {
      eggCount,
      showSecret,
      secretClickCount,
      hasVisitedSecretRoom,
      handleEggClick,
      handleSecretClick,
      goToFortune
    }
  }
}
</script>

<style scoped>
.who-am {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #e1e7ef;
  background-color: #0a0c0f;
  min-height: 100vh;
}

h1 {
  font-size: 3rem;
  background: linear-gradient(135deg, #b3a0ff, #8f9eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  color: #b3a0ff;
  margin-bottom: 1.5rem;
  border-left: 4px solid #42b983;
  padding-left: 1rem;
}

.profile-header {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.status-badge {
  background: #1f2a36;
  padding: 0.3rem 1rem;
  border-radius: 40px;
  border: 1px solid #31465c;
  font-size: 0.9rem;
  color: #b7cced;
}

.bio-card, .project-card, .skills-card, .easter-eggs {
  background: rgba(18, 22, 28, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(66, 80, 96, 0.3);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 1rem 0;
  font-size: 1.2rem;
  color: #b7cced;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.highlight {
  color: #42b983;
  font-weight: bold;
}

.project-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px dashed #31465c;
  font-size: 1.3rem; 
  font-weight: bold; 
}

.project-line:last-child {
  border-bottom: none;
}

.progress-tag {
  background: #1f2a36;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 1.2rem;
  color: #8f9eff;
}

.skill-item {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-item span:first-child {
  min-width: 100px;
  color: #b7cced;
}

.skill-bar {
  flex: 1;
  height: 24px;
  background: #1b232e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2c3a48;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #73efb7, #7325f0);
  color: white;
  font-size: 0.8rem;
  line-height: 24px;
  padding-left: 8px;
  text-align: left;
  border-radius: 12px;
}

.egg-item {
  padding: 1rem;
  background: #1b232e;
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  gap: 10rem;
  align-items: center;
  user-select: none;
}

.egg-item:hover {
  background: #232e3c;
  transform: translateX(5px);
}

.secret-message {
  color: #ff9b8c;
  font-style: italic;
}

.construction-note {
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #506277;
  font-size: 0.9rem;
}

.glow-dot {
  width: 6px;
  height: 6px;
  background: #42b983;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.3); }
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
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
  display: inline-block;
}

.back-link:hover {
  background: #2a3848;
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.3);
}
</style>