<!--
  ===== 备份：NewIndex.vue 的当前版本 =====
  原路径: src/components/NewIndex.vue
  备份时间: 2026-06-02
  说明: 此文件为 NewIndex 的完整备份，防止后续修改出问题时可快速恢复。
-->
<template>
  <div class="new-homepage" :class="{ 'wallpaper-active': bgMode === 'image' }">
    <!-- 头像 + 姓名 — 页面全局居中 -->
    <div class="identity" v-show="!showCompany">
      <div class="identity-top">
        <div class="avatar-box">
          <div class="avatar-ring"></div>
          <div class="avatar-inner">BQ</div>
        </div>
        <h1 class="name-main">Briandolph Qi</h1>
      </div>
      <p class="name-sub">Developer &amp; Bug Creator</p>
    </div>

    <!-- 主内容卡片 -->
    <div class="main-wrapper" v-show="!showCompany">
      <!-- ===== 左栏 ===== -->
      <div class="left-col">
        <!-- 简介卡片 -->
        <div class="bio-card cards" @click="toggleBio">
          <div class="bio-content">
            <span class="bio-quote-mark">"</span>
            <div class="bio-text" :class="{ en: bioAlt }">
              <p>{{ bioText.line1 }}</p>
              <p>{{ bioText.line2 }}</p>
            </div>
            <span class="bio-quote-mark bio-quote-end">"</span>
          </div>
        </div>

        <!-- 社交链接 -->
        <div class="social-bar cards">
          <span class="social-tip">{{ socialTip }}</span>
          <div class="social-icons">
            <a
              v-for="link in socialLinks"
              :key="link.name"
              :href="link.url"
              :target="link.url.startsWith('http') ? '_blank' : undefined"
              :rel="link.url.startsWith('http') ? 'noopener' : undefined"
              class="social-icon-btn"
              @click="handleSocialClick(link, $event)"
              @mouseenter="socialTip = link.tip"
              @mouseleave="socialTip = '通过这里联系我吧'"
            >
              <span class="social-emoji">{{ link.icon }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- ===== 右栏 ===== -->
      <div class="right-col">
        <!-- 时间 -->
        <div class="time-card cards">
          <div class="time-date">
            <span>{{ now.year }}&nbsp;年&nbsp;</span>
            <span>{{ now.month }}&nbsp;月&nbsp;</span>
            <span>{{ now.day }}&nbsp;日&nbsp;</span>
            <span class="sm-hidden">{{ now.weekday }}</span>
          </div>
          <div class="time-clock">
            {{ now.hour }}:{{ now.minute }}:{{ now.second }}
          </div>
        </div>

        <!-- 一言 -->
        <div class="hitokoto-card cards" @click="fetchHitokoto">
          <Transition name="fade" mode="out-in">
            <div class="hitokoto-content" :key="hitokoto.text">
              <span class="hito-quote hito-quote-open">&#8220;</span>
              <div class="hito-text-wrap">
                <span class="hito-text">{{ hitokoto.text }}</span>
              </div>
              <span class="hito-quote hito-quote-close">&#8221;</span>
            </div>
          </Transition>
        </div>


      </div>
    </div>

    <!-- 背景音乐 -->
    <div ref="musicContainer" class="bg-music"></div>

    <!-- 页脚 -->
    <footer class="site-footer" :class="{ blur: bgMode === 'image' }" v-show="!showCompany">
      <p>
        Copyright&nbsp;&copy;&nbsp;{{ now.year }}&nbsp;
        <span>Briandolph Qi</span>
        <span class="hidden">&nbsp;·&nbsp;施工精灵说：又摸了一天鱼</span>
      </p>
    </footer>

    <!-- Toast -->
    <Transition name="toast-fade">
      <div v-if="toast.show" class="global-toast">{{ toast.msg }}</div>
    </Transition>

    <!-- 公司信息弹窗 -->
    <Transition name="modal-fade">
      <div v-if="showCompany" class="company-overlay" @click.self="showCompany = false">
        <CompanyInfo @close="showCompany = false" />
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { hasItem, setItem, STORAGE_KEYS } from '../utils/storage'
import hitokotoData from '@/data/hitokoto.json'
import CompanyInfo from './CompanyInfo.vue'

export default {
  name: 'NewIndexPage',
  components: { CompanyInfo },
  setup() {
    const bgMode = inject('bgMode', ref('solid'))
    const router = useRouter()

    // ===== 时间 =====
    const now = reactive({
      year: '', month: '', day: '', weekday: '',
      hour: '', minute: '', second: ''
    })
    let timeTimer = null

    const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

    function tick() {
      const d = new Date()
      now.year = d.getFullYear()
      now.month = String(d.getMonth() + 1).padStart(2, '0')
      now.day = String(d.getDate()).padStart(2, '0')
      now.weekday = weekMap[d.getDay()]
      now.hour = String(d.getHours()).padStart(2, '0')
      now.minute = String(d.getMinutes()).padStart(2, '0')
      now.second = String(d.getSeconds()).padStart(2, '0')
    }

    // ===== 简介切换 =====
    const bioAlt = ref(false)
    const bioText = reactive({
      line1: '一个热爱编程、喜欢捣鼓各种新奇技术的开发者。',
      line2: '白天修复Bug，夜晚创造Bug，在Ctrl+C和Ctrl+V之间寻找代码的真谛。相信AI能改变世界，更相信咖啡能拯救世界。'
    })
    const bioBackup = { line1: bioText.line1, line2: bioText.line2 }

    function toggleBio() {
      bioAlt.value = !bioAlt.value
      if (bioAlt.value) {
        bioText.line1 = 'Hello there! '
        bioText.line2 = 'Welcome to my digital garden. Feel free to look around — there might be Easter eggs hiding somewhere.'
      } else {
        bioText.line1 = bioBackup.line1
        bioText.line2 = bioBackup.line2
      }
    }

    // ===== 社交链接 =====
    const socialTip = ref('通过这里联系我吧')
    const socialLinks = [
      { name: 'GitHub', url: 'https://github.com/Brian-Qi', icon: '🐙', tip: '来 GitHub 看看我的代码' },
      { name: 'Email',  url: 'mailto:qisihao666@163.com', icon: '📧', tip: '给我发邮件' },
      { name: 'Company', url: '/company', icon: '🏢', tip: '彼岸时墟游戏工作室' },
      { name: 'Back',   url: '/', icon: '↩️', tip: 'Ciallo～(∠·ω< )⌒★' }
    ]

    function handleSocialClick(link, event) {
      if (link.name === 'Company') {
        event.preventDefault()
        showCompany.value = true
        return
      }
      if (!link.url.startsWith('http') && !link.url.startsWith('mailto')) {
        event.preventDefault()
        router.push(link.url)
      }
    }

    // ===== 一言 =====
    const hitokoto = reactive({ text: '这里应该显示一句话' })

    function fetchHitokoto() {
      if (!hitokotoData.length) return
      const idx = Math.floor(Math.random() * hitokotoData.length)
      hitokoto.text = hitokotoData[idx].text
    }

    // ===== 公司信息弹窗 =====
    const showCompany = ref(false)

    // ===== Toast =====
    const toast = reactive({ show: false, msg: '' })
    let toastTimer = null

    function showToast(msg) {
      clearTimeout(toastTimer)
      toast.msg = msg
      toast.show = true
      toastTimer = setTimeout(() => { toast.show = false }, 2200)
    }

    // ===== 音乐 =====
    const musicContainer = ref(null)
    const musicAudioRef = inject('musicAudio')
    let musicReady = false
    let resumePlaying = null

    function loadMusic() {
      if (!musicContainer.value) return
      if (musicAudioRef.value) {
        musicAudioRef.value.play().catch(() => {})
        return
      }
      const audio = document.createElement('audio')
      audio.loop = true
      audio.volume = 0.3
      audio.preload = 'none'
      musicContainer.value.appendChild(audio)
      musicAudioRef.value = audio

      // 延迟下载：仅在用户首次交互后才加载 bg.mp3，避免阻塞首屏渲染
      const musicSrc = '/music/bg.mp3'
      function startPlayback() {
        if (!musicAudioRef.value || musicReady) return
        if (!musicAudioRef.value.src) {
          musicAudioRef.value.src = musicSrc
          musicAudioRef.value.load()
        }
        musicAudioRef.value.play()
          .then(() => {
            musicReady = true
            if (resumePlaying) {
              document.removeEventListener('click', resumePlaying)
              document.removeEventListener('touchstart', resumePlaying)
              document.removeEventListener('keydown', resumePlaying)
              resumePlaying = null
            }
          })
          .catch(() => {})
      }
      // 不在 onMounted 阶段触发下载，等用户首次点击/触摸/按键后才加载
      resumePlaying = startPlayback
      document.addEventListener('click', resumePlaying)
      document.addEventListener('touchstart', resumePlaying)
      document.addEventListener('keydown', resumePlaying)
    }

    function stopMusic() {
      if (musicAudioRef.value) {
        musicAudioRef.value.pause()
      }
    }

    // ===== 生命周期 =====
    onMounted(() => {
      // 隐藏成就标记：从 ComingSoon 返回时触发
      if (!hasItem(STORAGE_KEYS.ACHIEVEMENTS.MUSIC_LOVER)) {
        setItem('from_index_visited', true)
      }

      tick()
      timeTimer = setInterval(tick, 1000)

      fetchHitokoto()

      // DOM 就绪后再加载音乐（watch 的 immediate 在 setup 阶段就跑，此时 DOM 还没挂载）
      if (bgMode.value === 'image') loadMusic()

      // 时间问候
      const hour = new Date().getHours()
      let greet
      if (hour < 6) greet = '凌晨了还在写代码？早点休息 🌙'
      else if (hour < 9) greet = '早上好！新的一天从写Bug开始 ☀️'
      else if (hour < 12) greet = '上午好！摸鱼的好时光 🎣'
      else if (hour < 14) greet = '中午好！该续杯咖啡了 ☕'
      else if (hour < 18) greet = '下午好！Bug修完了吗？🐛'
      else if (hour < 22) greet = '晚上好！高效时段到了 💻'
      else greet = '夜深了，和Bug搏斗中… 🦉'

      setTimeout(() => showToast(greet), 400)
    })

    onUnmounted(() => {
      clearInterval(timeTimer)
      stopMusic()
      clearTimeout(toastTimer)
      if (resumePlaying) {
        document.removeEventListener('click', resumePlaying)
        document.removeEventListener('touchstart', resumePlaying)
        document.removeEventListener('keydown', resumePlaying)
        resumePlaying = null
      }
    })

    // ===== 音乐随壁纸切换 =====
    watch(bgMode, (val) => {
      if (val === 'image') loadMusic()
      else stopMusic()
    })

    return {
      bgMode, now,
      bioAlt, bioText, toggleBio,
      socialTip, socialLinks, handleSocialClick,
      hitokoto, fetchHitokoto,
      toast,
      musicContainer,
      showCompany
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'DigifaceWide';
  src: url('~@/assets/fonts/DigifaceWide-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
/* ============================================
   NewIndex — 完全参照 imsyy/home 风格
   ============================================ */

.new-homepage {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: #333;
  color: #fff;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  line-height: 1.5;
  transition: background 0.6s ease;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 8vh;
}

a, p {
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: #fff;
}

/* ---------- 主布局 ---------- */
.main-wrapper {
  position: relative;
  z-index: 2;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
  animation: fade-blur-main-in 0.8s ease;
}

@keyframes fade-blur-main-in {
  from { transform: scale(1.2); }
  to   { transform: scale(1); }
}

/* ============================================
   卡片通用
   ============================================ */
.cards {
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: scale(1);
  transition: transform 0.3s, backdrop-filter 0.3s, background 0.3s;
}
.cards:hover {
  transform: scale(1.01);
}
.cards:active {
  transform: scale(0.98);
}

/* ============================================
   左栏
   ============================================ */
.left-col {
  width: 50%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 头像 + 姓名 — 全局居中 */
.identity {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 0.6rem 0;
  margin-bottom: 1rem;
  animation: fade 0.5s;
}

.identity-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.35rem;
}

.avatar-box {
  position: relative;
  flex-shrink: 0;
  display: inline-block;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(#a78bfa, #6366f1, #ec4899, #a78bfa);
  animation: spin 6s linear infinite;
  opacity: 0.4;
}

@keyframes spin { to { transform: rotate(360deg); } }

.avatar-inner {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  z-index: 1;
  user-select: none;
  transition: transform 0.2s ease;
}

.avatar-inner:hover {
  transform: scale(1.05);
}

.name-main {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2.6rem, 6.5vw, 4.2rem) !important;
  font-weight: 550 !important;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #2563eb, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-text-stroke: 0.4px rgba(0, 0, 0, 0.25);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 22px rgba(255, 255, 255, 0.25);
}

.name-sub {
  font-size: 1.2rem !important;
  color: #cbd5e1;
  font-family: 'Great Vibes', cursive;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6), 0 0 8px rgba(255, 255, 255, 0.5);
}

/* 简介卡片 */
.bio-card {
  flex: 1;
  min-height: 130px;
  padding: 1rem;
  animation: fade 0.5s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.bio-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.bio-text {
  margin: 0.75rem 1rem;
  line-height: 2.2rem;
  font-size: 1.05rem;
  color: #cbd5e1;
  font-family: 'LXGW WenKai', cursive;
}
.bio-text p {
  font-size: 1.05rem !important;
  color: #cbd5e1;
  text-indent: 2em;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6), 0 0 8px rgba(255, 255, 255, 0.5);
}
.bio-text.en p {
  text-indent: 0.5em;
}

.bio-quote-mark {
  font-size: 1.4rem;
  color: #a78bfa;
  line-height: 1;
}

.bio-quote-end {
  align-self: flex-end;
}

/* 社交链接栏 */
.social-bar {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  animation: fade 0.5s;
}

.social-tip {
  margin-left: 12px;
  font-size: 0.8rem;
  color: #94a3b8;
  animation: fade 0.5s;
  white-space: nowrap;
}

.social-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.social-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin: 0 6px;
  border-radius: 4px;
  transition: transform 0.3s, background 0.3s;
  text-decoration: none;
}

.social-icon-btn:hover {
  transform: scale(1.15);
  background: rgba(255, 255, 255, 0.08);
}

.social-icon-btn:active {
  transform: scale(1);
}

.social-emoji {
  font-size: 1.05rem;
}

/* ============================================
   右栏
   ============================================ */
.right-col {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 时间卡片 */
.time-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  animation: fade 0.5s;
  height: 165px;
}

.time-date {
  font-size: 1.1rem;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}

.time-clock {
  margin-top: 10px;
  font-size: 3.25rem;
  letter-spacing: 4px;
  font-family: 'DigifaceWide', 'Consolas', monospace;
  text-align: center;
  color: #e2e8f0;
  text-shadow: 0 0 4px rgba(148, 163, 184, 0.4), 0 0 12px rgba(148, 163, 184, 0.2);
  display: inline-block;
  width: 100%;
  transform: scaleX(0.85);
}

/* 一言卡片 */
.hitokoto-card {
  flex: 1;
  min-height: 120px;
  padding: 20px;
  animation: fade 0.5s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.hitokoto-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  height: 100%;
  width: 100%;
}

.hito-text-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.hito-text {
  font-size: 1.2rem;
  font-family: 'LXGW WenKai', cursive;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.15);
  text-indent: 2em;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hito-from {
  margin-top: 10px;
  font-weight: bold;
  align-self: flex-end;
  font-size: 1.05rem;
  color: #c4b5fd;
}

.hito-quote {
  flex-shrink: 0;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
  pointer-events: none;
}
.hito-quote-open {
  align-self: flex-start;
}
.hito-quote-close {
  align-self: flex-end;
}

/* ============================================
   背景音乐
   ============================================ */
.bg-music {
  display: none;
}

/* ============================================
   页脚
   ============================================ */
.site-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 2;
  font-size: 14px;
  color: #fff;
  opacity: 0.7;
}

.site-footer.blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.25);
  font-size: 16px;
}

/* ============================================
   Toast
   ============================================ */
.global-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #efefef;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  z-index: 999;
  white-space: nowrap;
  border: 1px solid transparent;
}

.toast-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.toast-fade-enter-from,
.toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }

/* ============================================
   动画
   ============================================ */
@keyframes fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.fade-enter-active { transition: opacity 0.3s ease; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.text-hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ============================================
   壁纸模式
   ============================================ */
.new-homepage.wallpaper-active {
  background: transparent !important;
}

.new-homepage.wallpaper-active .cards {
  background-color: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.new-homepage.wallpaper-active .bio-card:active {
  background-color: rgba(255, 255, 255, 0.06);
}

.new-homepage.wallpaper-active .social-bar:hover {
  background-color: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.new-homepage.wallpaper-active .time-date,
.new-homepage.wallpaper-active .time-clock {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 1100px) {
  .main-wrapper {
    max-width: 100%;
    padding: 0 1.25rem;
  }
}

@media (max-width: 860px) {
  .new-homepage {
    align-items: flex-start;
    overflow-y: auto;
    height: calc(100vh - 52px);
  }

  .main-wrapper {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 1rem 0.5rem;
    max-height: none;
  }

  .left-col, .right-col {
    width: 100%;
    margin-right: 0;
  }

  .bio-card, .social-bar { max-width: 100%; }

  .avatar-inner {
    width: 68px; height: 68px; font-size: 1.5rem;
  }
  .avatar-ring { inset: -3px; }

  .social-icons { width: 100%; justify-content: space-evenly; }

  .time-card { height: 140px; }
  .time-clock { font-size: 2.5rem; }
}

@media (max-width: 480px) {
  .identity-top {
    gap: 0.5rem;
  }
  .name-main { font-size: 2.1rem !important; }
  .bio-card { margin-top: 0.5rem; }
  .time-clock { font-size: 2rem; }
  .hidden { display: none; }
  .sm-hidden { display: none; }
  .site-footer { font-size: 0.8rem; }
  .site-footer.blur { font-size: 0.8rem; }
}

/* ============================================
   公司信息弹窗
   ============================================ */
.company-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-fade-enter-active { transition: opacity 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-fade-enter-active .company-card {
  animation: modalPop 0.35s ease;
}
@keyframes modalPop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
