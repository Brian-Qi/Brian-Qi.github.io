<template>
  <div
    class="who-am"
    ref="containerRef"
    @wheel.prevent="handleWheel"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
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
              <li>
                💻 当前职业：<span class="highlight">代码缝补匠</span>
                <p class="italic">自称</p>
              </li>
              <li>
                🌙 夜间活动：<span class="highlight">与Bug搏斗</span>
                <p class="italic">胜率约 30%</p>
              </li>
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
            <li>
              壁纸 → 小红车里吃灰
              <p class="italic">(我看未必)</p>
              的高质量壁纸
            </li>
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
            <span class="secret-message" style="margin-left: auto">点击查看 →</span>
          </div>
          <div class="egg-item" @click="handleEggClick">
            <span>🔨 点击次数：{{ eggCount }}</span>
            <span v-if="eggCount >= 50" class="secret-message" style="margin-left: auto">🎉 成就达成！</span>
            <span v-else-if="eggCount > 40" class="secret-message" style="margin-left: auto">好吧你赢了 🏆</span>
            <span v-else-if="eggCount > 30" class="secret-message" style="margin-left: auto">够啦！(╯°□°)╯ ︵ ┻━┻</span>
            <span v-else-if="eggCount > 20" class="secret-message" style="margin-left: auto">给你闲的(*￣︿￣)</span>
            <span v-else-if="eggCount > 10" class="secret-message" style="margin-left: auto">你还真点啊？</span>
          </div>
          <div class="egg-item" @click="goToMoyu">
            <span>🐟 摸鱼区</span>
            <span class="secret-message" style="margin-left: auto">点击进入 →</span>
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
        router.push('/self/who_i_am/achieve_idle')
      } else if (eggCount.value === 60) {
        router.push('/self/who_i_am/achieve_idle/achieve_super_idle')
      }
    }

    const goToFortune = () => {
      router.push('/self/who_i_am/fortune')
    }

    const goToMoyu = () => {
      router.push('/self/moyu')
    }

    return {
      containerRef,
      currentSection,
      eggCount,
      handleWheel,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleEggClick,
      goToMoyu,
      goToFortune,
      goToSection
    }
  }
}
</script>

<style scoped src="../styles/who-i-am.css"></style>
