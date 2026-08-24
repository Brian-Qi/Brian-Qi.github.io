<template>
  <div class="who-am" ref="containerRef" @wheel.prevent="handleWheel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- 左侧固定导航 -->
    <nav class="side-indicator">
      <span
        v-for="i in 4"
        :key="i"
        class="indicator-dot"
        :class="{ active: currentSection === i - 1 }"
        @click="goToSection(i - 1)"
      ></span>
    </nav>

    <!-- 四个区域（竖向排列） -->
    <div class="sections-container">
      <!-- 区域1: 当前身份 -->
      <section class="section-card">
        <div class="section-inner">
          <h2>🔍 当前身份</h2>

          <div class="info-block">
            <h3 class="info-title">📋 基础信息</h3>
            <ul>
              <li>💻 当前职业：<span class="highlight">代码缝补匠</span><p class="italic">  自称</p></li>
              <li>🌙 夜间活动：<span class="highlight">与Bug搏斗</span><p class="italic">  胜率约 30%</p></li>
              <li>☕ 生命体征：<span class="highlight">咖啡因 5.0</span></li>
              <li>🎯 天赋技能：<span class="highlight">Ctrl+C / Ctrl+V 精通</span></li>
            </ul>
          </div>

          <div class="info-block">
            <h3 class="info-title">⏰ 作息时间</h3>
            <div class="schedule-grid">
              <div class="schedule-item">
                <span class="time">🌅 起床</span>
                <span class="activity">看心情</span>
              </div>
              <div class="schedule-item">
                <span class="time">💻 高效时段</span>
                <span class="activity">凌晨 2-4 点</span>
              </div>
              <div class="schedule-item">
                <span class="time">😴 睡眠</span>
                <span class="activity">太阳叫我</span>
              </div>
            </div>
          </div>

          <div class="info-block">
            <h3 class="info-title">💬 口头禅</h3>
            <p class="quote">"我不到啊...在我机子上跑的好好的..."</p>
          </div>
        </div>
      </section>

      <!-- 区域2: 当前项目状态 -->
      <section class="section-card">
        <div class="section-inner">
          <h2>🚀 在搞啥</h2>
          <ul class="simple-list">
            <li>这个网站 → <span class="highlight">80% 摸鱼</span>，20% 写代码</li>
            <li>下个项目 → <span class="highlight">还在想(叉腰)</span> 大概 可能 也许 鬼知道呢</li>
            <li>日常任务 → 修自己的bug，笑别人的bug，然后发现自己就是bug</li>
          </ul>

          <h2>🎧 摸鱼装备</h2>
          <ul class="simple-list">
            <li>耳机 → 用来假装在听歌，其实在发呆</li>
            <li>手机 → 主要是在AI帮我干活的时候摸鱼</li>
            <li>壁纸 → 小红车里吃灰<p class="italic">(我看未必)</p>的高质量壁纸</li>
          </ul>
        </div>
      </section>

      <!-- 区域3: 不靠谱能力图鉴 -->
      <section class="section-card">
        <div class="section-inner">
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
            <span>Ctrl+C/V</span>
            <div class="skill-bar"><div class="skill-fill" style="width: 99%">99%</div></div>
          </div>
          <div class="skill-item">
            <span>摸鱼</span>
            <div class="skill-bar"><div class="skill-fill fire-text" style="width: 100%">MAX</div></div>
          </div>
          <div class="skill-item">
            <span>调教AI</span>
            <div class="skill-bar"><div class="skill-fill" style="width: 95%">95%</div></div>
          </div>
        </div>
      </section>

      <!-- 区域4: 彩蛋区 -->
      <section class="section-card">
        <div class="section-inner">
          <h2>🥚 彩蛋区</h2>
          <div class="egg-item" @click="goToFortune">
            <span>🔮 今日运势</span>
            <span class="secret-message" style="margin-left: auto;">点击查看 →</span>
          </div>
          <div class="egg-item" @click="handleEggClick">
            <span>🔨 点击次数：{{ eggCount }}</span>
            <span v-if="eggCount >= 50" class="secret-message" style="margin-left: auto;">🎉 成就达成！</span>
            <span v-else-if="eggCount > 40" class="secret-message" style="margin-left: auto;">好吧你赢了 🏆</span>
            <span v-else-if="eggCount > 30" class="secret-message" style="margin-left: auto;">够啦！(╯°□°)╯ ︵ ┻━┻</span>
            <span v-else-if="eggCount > 20" class="secret-message" style="margin-left: auto;">给你闲的(*￣︿￣)</span>
            <span v-else-if="eggCount > 10" class="secret-message" style="margin-left: auto;">你还真点啊？</span>
          </div>
          <div class="egg-item" @click="handleSecretClick">
            <span>🤫 秘密按钮</span>
            <span v-if="hasVisitedSecretRoom" class="secret-message" style="margin-left: auto;">🔓 已解锁，点击进入</span>
            <span v-else-if="showSecret" class="secret-message" style="margin-left: auto;">并没有什么秘密</span>
          </div>
        </div>
      </section>
    </div>

    <!-- 底部固定导航 -->
    <footer class="who-am-footer">
      <router-link to="/" class="back-link">
        <span class="button-icon">🏠</span>
        回到首页
      </router-link>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'WhoIAm',
  setup() {
    const router = useRouter()
    const containerRef = ref(null)
    const currentSection = ref(0)
    const eggCount = ref(0)
    const showSecret = ref(false)
    const secretClickCount = ref(0)
    const hasVisitedSecretRoom = ref(localStorage.getItem('hasVisitedSecretRoom') === 'true')

    let isScrolling = false
    let scrollTimeout = null
    let touchStartY = 0
    let touchDeltaY = 0

    const goToSection = (index) => {
      if (index < 0 || index > 3 || isScrolling) return
      currentSection.value = index
      scrollToSection(index)
    }

    const scrollToSection = (index) => {
      const container = containerRef.value
      if (!container) return

      isScrolling = true
      const sections = container.querySelectorAll('.section-card')
      const targetSection = sections[index]
      if (!targetSection) return

      container.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      })

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 600)
    }

    const handleWheel = (e) => {
      if (isScrolling) return

      const delta = e.deltaY || e.deltaX
      if (Math.abs(delta) < 30) return

      if (delta > 0 && currentSection.value < 3) {
        goToSection(currentSection.value + 1)
      } else if (delta < 0 && currentSection.value > 0) {
        goToSection(currentSection.value - 1)
      }
    }

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchDeltaY = 0
    }

    const handleTouchMove = (e) => {
      touchDeltaY = touchStartY - e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      if (Math.abs(touchDeltaY) > 50 && !isScrolling) {
        if (touchDeltaY > 0 && currentSection.value < 3) {
          goToSection(currentSection.value + 1)
        } else if (touchDeltaY < 0 && currentSection.value > 0) {
          goToSection(currentSection.value - 1)
        }
      }
      touchDeltaY = 0
    }

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
      if (hasVisitedSecretRoom.value) {
        router.push('/who_i_am/secret_quiz')
        return
      }

      secretClickCount.value++
      showSecret.value = !showSecret.value

      if (secretClickCount.value >= 20) {
        router.push('/who_i_am/secret_quiz')
      }
    }

    return {
      containerRef,
      currentSection,
      eggCount,
      showSecret,
      hasVisitedSecretRoom,
      handleWheel,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleEggClick,
      handleSecretClick,
      goToFortune,
      goToSection
    }
  }
}
</script>

<style scoped>
.who-am {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--app-text);
  background-color: var(--app-bg);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: background-color var(--app-transition), color var(--app-transition);
}

.who-am::-webkit-scrollbar {
  display: none;
}

/* 左侧固定导航 */
.side-indicator {
  position: fixed;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--app-divider);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-dot.active {
  background: #42b983;
  transform: scale(1.4);
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.7);
}

/* 内容区域 */
.sections-container {
  padding: 0;
  max-width: 700px;
  margin: 0 auto;
}

.section-card {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 1rem 80px;
  box-sizing: border-box;
}

.section-inner {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: var(--app-bg-card-translucent);
  backdrop-filter: blur(16px);
  border: 1px solid var(--app-border-dark);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--app-shadow-lg);
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  transition: background var(--app-transition), border-color var(--app-transition), box-shadow var(--app-transition);
}

h2 {
  font-size: 1.5rem;
  color: #b3a0ff;
  margin-bottom: 1.5rem;
  border-left: 4px solid #42b983;
  padding-left: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 0.8rem 0;
  font-size: 1.1rem;
  color: var(--app-fun-text);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.highlight {
  color: #42b983;
  font-weight: bold;
}

/* 信息区块 */
.info-block {
  margin-bottom: 1.5rem;
}

.info-block:last-child {
  margin-bottom: 0;
}

.info-title {
  font-size: 1.1rem;
  color: var(--app-accent-text);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

/* 作息时间表 */
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.schedule-item {
  background: var(--app-input-bg);
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid var(--app-input-border);
  transition: background var(--app-transition), border-color var(--app-transition);
}

.schedule-item .time {
  display: block;
  font-size: 0.85rem;
  color: var(--app-accent-text);
  margin-bottom: 0.25rem;
}

.schedule-item .activity {
  display: block;
  font-size: 0.9rem;
  color: var(--app-fun-text);
  font-weight: 500;
}

/* 工具标签 */
.tools-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tool-tag {
  background: var(--app-btn-secondary-bg);
  border: 1px solid var(--app-btn-secondary-border);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--app-fun-text);
  transition: all 0.2s ease;
}

.tool-tag:hover {
  background: var(--app-btn-secondary-hover);
  border-color: #42b983;
  color: #42b983;
}

/* 名言 */
.quote {
  background: linear-gradient(135deg, rgba(179, 160, 255, 0.1), rgba(143, 158, 255, 0.1));
  border-left: 3px solid #b3a0ff;
  padding: 1rem 1.25rem;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  color: var(--app-fun-text);
  font-size: 1rem;
  margin: 0;
}
.italic {
  font-style: italic;
  color: var(--app-text-muted);
  margin: 0;
  display: inline;
  font-size: 0.5rem;
}

.simple-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.simple-list li {
  margin: 0.6rem 0;
  font-size: 1.05rem;
  color: var(--app-fun-text);
}

.simple-text {
  font-size: 1.05rem;
  color: var(--app-fun-text);
  margin: 0;
}

.project-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px dashed var(--app-divider);
  font-size: 1.1rem;
}

.project-line:last-child {
  border-bottom: none;
}

.progress-tag {
  background: var(--app-btn-secondary-bg);
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--app-accent-text);
  transition: background var(--app-transition), color var(--app-transition);
}

.skill-item {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-item span:first-child {
  min-width: 80px;
  color: var(--app-fun-text);
}

.skill-bar {
  flex: 1;
  height: 24px;
  background: var(--app-input-bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--app-input-border);
  transition: background var(--app-transition), border-color var(--app-transition);
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #73efb7, #7325f0);
  color: white;
  font-size: 0.8rem;
  line-height: 24px;
  padding-left: 8px;
  border-radius: 12px;
}

.egg-item {
  padding: 1rem;
  background: var(--app-input-bg);
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: center;
  user-select: none;
}

.egg-item:hover {
  background: var(--app-btn-secondary-hover);
  transform: translateX(5px);
}

.egg-item:last-child {
  margin-bottom: 0;
}

.secret-message {
  color: #ff9b8c;
  font-style: italic;
}

/* 底部固定导航 */
.who-am-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  text-align: center;
  background: linear-gradient(0deg, var(--app-bg-card-translucent) 0%, transparent 100%);
  z-index: 100;
  transition: background var(--app-transition);
}

.back-link {
  color: var(--app-accent-green-text);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.4rem 1rem;
  border: 1px solid var(--app-btn-secondary-border);
  border-radius: 40px;
  background: var(--app-btn-secondary-bg);
  transition: all 0.2s ease;
  display: inline-block;
}

.back-link:hover {
  background: var(--app-btn-secondary-hover);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.3);
}

/* ========== 移动端优化 ========== */
@media (max-width: 768px) {
  .side-indicator {
    left: 0.5rem;
    gap: 0.6rem;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
  }

  .sections-container {
    padding: 0;
  }

  .section-card {
    min-height: 100vh;
    padding: 70px 0.75rem 90px;
    box-sizing: border-box;
  }

  .section-inner {
    padding: 1.25rem;
    border-radius: 16px;
  }

  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  li {
    font-size: 0.95rem;
    margin: 0.65rem 0;
  }

  .info-block {
    margin-bottom: 1rem;
  }

  .info-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .schedule-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .tools-tags {
    gap: 0.4rem;
  }

  .tool-tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  .quote {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .simple-list li {
    margin: 0.6rem 0;
    font-size: 1.05rem;
    color: var(--app-fun-text);
  }

  .simple-text {
    font-size: 1.05rem;
    color: var(--app-fun-text);
    margin: 0;
  }

.project-line {
    font-size: 0.95rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .skill-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .skill-item span:first-child {
    min-width: auto;
  }

  .skill-bar {
    width: 100%;
  }

  .egg-item {
    padding: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .egg-item .secret-message {
    margin-left: 0 !important;
  }

  .back-link {
    font-size: 0.85rem;
    padding: 0.3rem 0.8rem;
  }
}
/* 火焰文字效果 */
.fire-text {
  color: #ff6b35 !important;
  text-shadow: 0 0 5px #ff6b35, 0 0 10px #f7931a, 0 0 15px #ff3d00, 0 0 20px rgba(255, 61, 0, 0.7) !important;
  font-weight: 900;
  font-size: 1.1em;
}

</style>
