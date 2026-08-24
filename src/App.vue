<template>
  <div id="app" :data-theme="effectiveTheme" :class="{ 'wallpaper-active': effectiveBgMode === 'image', 'intro-mode': !isIntroDone && (isHomeRoute || introOverlayVisible) }">
    <!-- 壁纸模式 - 全局背景层 -->
    <div ref="wallpaperRef" class="app-wallpaper" :style="{ opacity: effectiveBgMode === 'image' ? 1 : 0 }"></div>
    <!-- 深色模糊遮罩 - 压暗背景突出文字 -->
    <div class="app-wallpaper-overlay" v-show="effectiveBgMode === 'image'"></div>

    <!-- Toast 全局提示 -->
    <div class="app-toast" :class="{ show: toastVisible }">{{ toastMessage }}</div>

    <!-- 全局导航栏 -->
    <nav class="app-navbar">
      <div class="app-navbar-inner">
        <span class="app-nav-logo">Briandolph Qi</span>
        <div class="app-nav-actions" v-if="!isHomeRoute">
          <button class="app-theme-toggle" @click="toggleTheme"
            :title="themeIcon === '🌙' ? '切换浅色模式' : '切换深色模式'"
            :aria-label="themeIcon === '🌙' ? '切换浅色模式' : '切换深色模式'">
            {{ themeIcon }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="achievement" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 桌面歌词 — 放在过渡动画外，避免 position:fixed 受 transform 影响 -->
    <LyricBar v-if="isHomeRoute" />

    <!-- 入场动画遮罩 — 独立于路由，ComingSoon 点击后即覆盖，再切路由 -->
    <Transition name="intro-out" @after-leave="isIntroDone = true">
      <div v-if="introOverlayVisible" class="intro-overlay" @click.stop>
        <div class="intro-bg-blur" :style="{ backgroundImage: `url('/壁纸.webp')` }"></div>
        <div class="intro-noise"></div>
        <canvas ref="particleCanvas" class="intro-canvas"></canvas>
        <div class="intro-avatar-wrapper" @click.stop="onIntroClick">
          <div class="intro-avatar-box">
            <div class="intro-avatar-ring"></div>
            <div class="intro-avatar-inner">BQ</div>
          </div>
          <p class="intro-hint">点击进入</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, provide, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItem, setItem, hasItem } from './utils/storage'
import LyricBar from './components/LyricBar.vue'

// 模块级标记 — 不依赖 Vue 响应式，一次会话只触发一次遮罩
let _introDismissed = false

// ========== 粒子系统 (module-level, 蓝紫配色) ==========
const PARTICLE_COLORS = ['#3b82f6', '#60a5fa', '#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#2563eb', '#4f46e5']

function createParticleArray(canvas, count) {
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.06,
      size: 1.5 + Math.random() * 4,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      opacity: 0.15 + Math.random() * 0.35
    })
  }
  return arr
}

function initParticles(canvas) {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  function resize() {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.scale(dpr, dpr)
  }
  resize()

  const isMobile = window.innerWidth < 768
  const particleCount = isMobile ? 45 : 100
  const particles = createParticleArray(canvas, particleCount)
  const CONNECTION_DIST = isMobile ? 0 : 110
  const MOUSE_RADIUS = 130

  let mouseX = -9999
  let mouseY = -9999
  let burstActive = false
  let burstProgress = 0
  let animId = null
  let destroyed = false

  function onMouseMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  function onResize() { resize() }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  function burst(cx, cy) {
    burstActive = true
    burstProgress = 0
    for (const p of particles) {
      const dx = p.x - cx
      const dy = p.y - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = 4 + Math.random() * 6
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }
  }

  function loop() {
    if (destroyed) return
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    if (burstActive) {
      burstProgress += 0.02
      if (burstProgress >= 1) burstActive = false
    }

    // connect lines first (behind particles)
    if (!isMobile && !destroyed) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            // disconnect near mouse
            const mx1 = particles[i].x - mouseX
            const my1 = particles[i].y - mouseY
            const mx2 = particles[j].x - mouseX
            const my2 = particles[j].y - mouseY
            const nearMouse = Math.min(
              Math.sqrt(mx1 * mx1 + my1 * my1),
              Math.sqrt(mx2 * mx2 + my2 * my2)
            ) < MOUSE_RADIUS

            if (!nearMouse) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              const alpha = (1 - dist / CONNECTION_DIST) * 0.18
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }
    }

    // update & draw particles
    for (const p of particles) {
      // mouse repulsion
      const dx = p.x - mouseX
      const dy = p.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (1 - dist / MOUSE_RADIUS) * 1.2
        p.vx += (dx / dist) * force
        p.vy += (dy / dist) * force
      }

      p.x += p.vx
      p.y += p.vy

      // damping
      if (!burstActive) {
        p.vx *= 0.995
        p.vy *= 0.995
      }

      // wrap around
      if (p.x < -20) p.x = canvas.width / dpr + 20
      if (p.x > canvas.width / dpr + 20) p.x = -20
      if (p.y < -20) p.y = canvas.height / dpr + 20
      if (p.y > canvas.height / dpr + 20) p.y = -20

      // drift — slow rise with irregular wandering
      if (!burstActive) {
        p.vx += (Math.random() - 0.5) * 0.10
        p.vy += (Math.random() - 0.5) * 0.10 - 0.004
      }

      // draw
      const alpha = burstActive ? p.opacity * (1 - burstProgress) : p.opacity
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = alpha
      ctx.fill()
      ctx.globalAlpha = 1
    }

    animId = requestAnimationFrame(loop)
  }

  animId = requestAnimationFrame(loop)

  return {
    burst: (cx, cy) => burst(cx, cy),
    destroy: () => {
      destroyed = true
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }
}

export default {
  name: 'App',
  components: { LyricBar },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // ===== 首页固定壁纸，其他页面纯色背景 =====
    const isHomeRoute = computed(() => route.path === '/index')
    const effectiveBgMode = computed(() => isHomeRoute.value ? 'image' : 'solid')

    // ===== 深浅主题（非首页切换、首页固定深色） =====
    const theme = ref(getItem('app_theme', 'dark'))
    const effectiveTheme = computed(() => isHomeRoute.value ? 'dark' : theme.value)
    const themeIcon = computed(() => theme.value === 'light' ? '☀️' : '🌙')

    function toggleTheme() {
      if (isHomeRoute.value) return
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
      setItem('app_theme', theme.value)

      // 主题切换计数 & 成就检测
      const KEY = 'theme_flips_count'
      const count = (parseInt(localStorage.getItem(KEY) || '0')) + 1
      localStorage.setItem(KEY, count.toString())
      if (count >= 20 && !hasItem('achieve_theme_flipper')) {
        setItem('achieve_theme_flipper', true)
        showToast('🏆 成就解锁：光影穿梭！')
        setTimeout(() => {
          router.push('/who_i_am/achievement_theme_flipper')
        }, 1800)
      }
    }

    // ===== Toast =====
    const toastVisible = ref(false)
    const toastMessage = ref('')
    let toastTimer = null

    function showToast(message) {
      clearTimeout(toastTimer)
      toastMessage.value = message
      toastVisible.value = true
      toastTimer = setTimeout(() => {
        toastVisible.value = false
      }, 2200)
    }

    // 入场动画状态（跨组件共享，控制导航栏 + 内容区显隐）
    const isIntroDone = ref(false)
    provide('isIntroDone', isIntroDone)

    // 遮罩控制
    const introOverlayVisible = ref(route.path === '/index' && !_introDismissed)
    function triggerIntroOverlay() {
      if (!_introDismissed) {
        introOverlayVisible.value = true
      }
    }
    function closeIntroOverlay() {
      _introDismissed = true
      introOverlayVisible.value = false
    }
    provide('triggerIntroOverlay', triggerIntroOverlay)

    // 粒子系统 — 遮罩显示时初始化，隐藏时销毁
    const particleCanvas = ref(null)
    let particleSystem = null

    watch(introOverlayVisible, async (visible) => {
      if (visible) {
        await nextTick()
        if (particleCanvas.value) {
          particleSystem = initParticles(particleCanvas.value)
        }
      } else {
        if (particleSystem) {
          particleSystem.destroy()
          particleSystem = null
        }
      }
    })

    function onIntroClick(e) {
      if (particleSystem && particleSystem.burst) {
        particleSystem.burst(e.clientX, e.clientY)
      }
      closeIntroOverlay()
      // 头像点击时手动触发音乐（click 被 .stop 拦截无法到达 document）
      if (musicAudioRef.value) {
        if (!musicAudioRef.value.src) {
          musicAudioRef.value.src = '/music/bg.mp3'
          musicAudioRef.value.load()
        }
        musicAudioRef.value.play().catch(() => {})
      }
    }

    // 路由守卫：会话内只弹一次
    const removeGuard = router.beforeEach((to) => {
      if (to.path === '/index' && !_introDismissed) {
        introOverlayVisible.value = true
      }
    })

    // 提供给子组件使用
    provide('showToast', showToast)
    provide('bgMode', effectiveBgMode)

    // ===== 音乐播放器（共享给 LyricBar） =====
    const musicAudioRef = ref(null)
    provide('musicAudio', musicAudioRef)

    // ===== 主题同步到 body =====
    function applyThemeToBody(t) {
      const isLight = t === 'light'
      document.body.style.backgroundColor = isLight ? '#f5f7fa' : '#0a0c0f'
      document.body.style.color = isLight ? '#2c3e50' : '#e2e8f0'
      document.body.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }

    watch(effectiveTheme, (newTheme) => {
      applyThemeToBody(newTheme)
    }, { immediate: true })

    // ===== 键盘快捷键 =====
    function handleKeydown(e) {
      if (e.key === 't' && e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        toggleTheme()
      }
    }

    // ===== 除成就界面外全局禁用滚动 =====
    watch(() => route.path, (path) => {
      if (path.includes('achieve')) {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      } else {
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
      }
    }, { immediate: true })

    const wallpaperRef = ref(null)

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
      // 延迟加载壁纸：等首屏内容渲染完毕后再下载 83KB 的壁纸图片
      if (wallpaperRef.value) {
        const loadWallpaper = () => {
          const img = new Image()
          img.onload = () => {
            wallpaperRef.value.style.background = 'url(\'/壁纸.webp\') center / cover no-repeat fixed'
          }
          img.src = '/壁纸.webp'
        }
        if (window.requestIdleCallback) {
          requestIdleCallback(loadWallpaper, { timeout: 2000 })
        } else {
          setTimeout(loadWallpaper, 100)
        }
      }
    })

    onUnmounted(() => {
      removeGuard()
      window.removeEventListener('keydown', handleKeydown)
      clearTimeout(toastTimer)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    })

    return {
      wallpaperRef,
      particleCanvas,
      effectiveTheme,
      effectiveBgMode,
      isHomeRoute,
      isIntroDone,
      introOverlayVisible,
      onIntroClick,
      themeIcon,
      toggleTheme,
      toastVisible,
      toastMessage
    }
  }
}
</script>

<style>
/* ===== 本地字体 ===== */
/* LXGW WenKai 霞鹜文楷 — 从 npm 包加载 */
@import '~lxgw-wenkai-webfont/lxgwwenkai-regular.css';

/* Great Vibes — 本地 ttf */
@font-face {
  font-family: 'Great Vibes';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('~@/assets/fonts/GreatVibes-Regular.ttf') format('truetype');
}

/* 导入移动端优化样式 */
@import './styles/mobile-optimization.css';
@import './styles/mobile-utils.css';

/* ========== 全局主题变量 ========== */
#app[data-theme="light"] {
  --app-bg: #f5f7fa;
  --app-bg-card: #ffffff;
  --app-bg-card-hover: #f8f9fc;
  --app-bg-card-translucent: rgba(255, 255, 255, 0.85);
  --app-bg-dark-card: #ffffff;
  --app-bg-dark-section: rgba(245, 248, 252, 0.8);
  --app-text: #2c3e50;
  --app-text-secondary: #6b7d95;
  --app-text-muted: #94a3b8;
  --app-text-light: #5a6d85;
  --app-text-muted-dark: #7b8da5;
  --app-border: #c8d2e0;
  --app-border-dark: #b0bcc8;
  --app-accent: #7c5cfc;
  --app-accent-light: #a78bfa;
  --app-accent-glow: rgba(124, 92, 252, 0.15);
  --app-tag-bg: #f0edff;
  --app-tag-text: #7c5cfc;
  --app-skill-bg: #eef2ff;
  --app-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  --app-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08);
  --app-shadow-card: 0 30px 50px -20px rgba(0, 0, 0, 0.1);
  --app-radius: 16px;
  --app-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --app-footer-border: #c8d2e0;
  --app-status-tag-bg: #f0f4ff;
  --app-status-tag-text: #6b8ab5;
  --app-status-tag-border: #b4c2d6;
  --app-fun-section-bg: rgba(240, 244, 250, 0.8);
  --app-fun-section-border: #bfcada;
  --app-fun-text: #5a6d85;
  --app-progress-bg: #e8ecf2;
  --app-progress-border: #bcc8d6;
  --app-construction-bg: #f0f4fa;
  --app-construction-border: #bfcada;
  --app-dialog-bg: linear-gradient(145deg, #ffffff, #f0f4fa);
  --app-dialog-border: #7c5cfc;
  --app-dialog-text: #2c3e50;
  --app-dialog-shadow: 0 0 60px rgba(124, 92, 252, 0.3);
  --app-face-color: #7c5cfc;
  --app-gradient-text: linear-gradient(135deg, #2c3e50, #7c5cfc);
  /* 泛用变量 - 覆盖所有子页面 */
  --app-page-gradient-start: #e8ecf2;
  --app-page-gradient-end: #f0eef4;
  --app-container-bg: rgba(255, 255, 255, 0.9);
  --app-input-bg: #eef2f7;
  --app-input-border: #c0c8d4;
  --app-btn-secondary-bg: #eef2f7;
  --app-btn-secondary-hover: #e0e6ef;
  --app-btn-secondary-border: #c0c8d4;
  --app-divider: #d0d7e2;
  --app-accent-text: #5a6dff;
  --app-accent-green-text: #2d9d6f;
}

#app[data-theme="dark"] {
  --app-bg: #0f1117;
  --app-bg-card: #1a1d28;
  --app-bg-card-hover: #202436;
  --app-bg-card-translucent: rgba(18, 22, 28, 0.75);
  --app-bg-dark-card: #1f2a36;
  --app-bg-dark-section: rgba(8, 12, 17, 0.6);
  --app-text: #e2e8f0;
  --app-text-secondary: #94a3b8;
  --app-text-muted: #64748b;
  --app-text-light: #ccdeff;
  --app-text-muted-dark: #7f95b5;
  --app-border: #2d3344;
  --app-border-dark: #31465c;
  --app-accent: #a78bfa;
  --app-accent-light: #c4b5fd;
  --app-accent-glow: rgba(167, 139, 250, 0.2);
  --app-tag-bg: #1e1b4b;
  --app-tag-text: #c4b5fd;
  --app-skill-bg: #1e2332;
  --app-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  --app-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
  --app-shadow-card: 0 30px 50px -20px rgba(0, 0, 0, 0.8);
  --app-footer-border: #2d3344;
  --app-status-tag-bg: #1f2a36;
  --app-status-tag-text: #bdd3f0;
  --app-status-tag-border: #31465c;
  --app-fun-section-bg: rgba(8, 12, 17, 0.6);
  --app-fun-section-border: #26323f;
  --app-fun-text: #b7cced;
  --app-progress-bg: #1b232e;
  --app-progress-border: #2c3a48;
  --app-construction-bg: #131e28;
  --app-construction-border: #334252;
  --app-dialog-bg: linear-gradient(145deg, #1f2a36, #0f1a22);
  --app-dialog-border: #ffd700;
  --app-dialog-text: #ffd700;
  --app-dialog-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
  --app-face-color: #18dddd;
  --app-gradient-text: linear-gradient(135deg, #ffffff, #c0ccd9);
  /* 泛用变量 - 覆盖所有子页面 */
  --app-page-gradient-start: #1a1f2a;
  --app-page-gradient-end: #2a1f2a;
  --app-container-bg: rgba(20, 25, 35, 0.9);
  --app-input-bg: #1b232e;
  --app-input-border: #31465c;
  --app-btn-secondary-bg: #1f2a36;
  --app-btn-secondary-hover: #2a3848;
  --app-btn-secondary-border: #31465c;
  --app-divider: #31465c;
  --app-accent-text: #8f9eff;
  --app-accent-green-text: #42b983;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  /* 全局文本换行保护 */
  overflow-wrap: break-word;
  word-wrap: break-word;
}

body {
  min-height: 100vh;
  font-size: 16px;
}

#app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--app-text, #e1e7ef);
  background-color: var(--app-bg, #0a0c0f);
  min-height: 100vh;
  transition: background var(--app-transition), color var(--app-transition);
}

/* 页面内容区 - 为固定导航栏留出空间 */
.app-content {
  padding-top: 60px;
  transition: opacity 0.6s ease;
}

/* ========== 全局导航栏 ========== */
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: var(--app-bg-card);
  border-bottom: 1px solid var(--app-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 0 1.5rem;
  transition: background var(--app-transition), border var(--app-transition), opacity 0.6s ease;
}

/* 入场动画期间完全隐藏导航栏 */
#app.intro-mode .app-navbar {
  opacity: 0;
  pointer-events: none;
}

/* 入场动画期间完全隐藏页面内容区（杜绝闪现） */
#app.intro-mode .app-content {
  opacity: 0;
  pointer-events: none;
}

/* ========== 入场遮罩 ========== */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0a0c10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

/* 模糊壁纸背景层 */
.intro-bg-blur {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: blur(50px);
  opacity: 0.13;
  transform: scale(1.1);
}

/* 噪点纹理层 */
.intro-noise {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* Canvas 粒子层 */
.intro-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.intro-avatar-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  opacity: 0;
  animation: intro-content-in 0.55s ease 0.08s forwards;
}

@keyframes intro-content-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.intro-avatar-box {
  position: relative;
  flex-shrink: 0;
  display: inline-block;
}

.intro-avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6, #8b5cf6, #a78bfa, #3b82f6);
  animation: spin 6s linear infinite;
  opacity: 0.45;
}

@keyframes spin { to { transform: rotate(360deg); } }

.intro-avatar-inner {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  animation: intro-pulse 2s ease-in-out infinite;
  user-select: none;
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.25);
}

@keyframes intro-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.intro-hint {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.42);
  letter-spacing: 0.15em;
}

/* 入场遮罩退出 — 点击后淡出放大 */
.intro-out-leave-active {
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.intro-out-leave-to {
  opacity: 0;
  transform: scale(1.08);
}

/* 壁纸模式 - 导航栏毛玻璃 */
.app-wallpaper {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}
.app-wallpaper-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
#app.wallpaper-active .app-navbar {
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

#app.wallpaper-active .app-theme-toggle {
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-color: rgba(255, 255, 255, 0.1);
}

#app.wallpaper-active .app-theme-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.app-navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.app-nav-logo {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--app-accent), #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.app-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-theme-toggle {
  width: 42px;
  height: 42px;
  border: 1px solid var(--app-border);
  border-radius: 50%;
  background: var(--app-bg-card);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--app-text);
}

.app-theme-toggle:hover {
  border-color: var(--app-accent);
  box-shadow: 0 0 16px var(--app-accent-glow);
  transform: rotate(15deg);
}

/* ========== 全局 Toast ========== */
.app-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: linear-gradient(135deg, var(--app-accent), #6366f1);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 8px 30px var(--app-accent-glow);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.app-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ========== 路由过渡动画 ========== */
.achievement-enter-active {
  animation: shineIn 0.45s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.achievement-leave-active {
  animation: shineOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes shineIn {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  60% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shineOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
}

/* ========== 全局响应式适配 ========== */

/* 使用流体字体系统 */
body {
  font-size: clamp(14px, 2.5vw, 16px);
}

h1 {
  font-size: clamp(1.4rem, 5vw, 3rem) !important;
  line-height: 1.3 !important;
}

h2 {
  font-size: clamp(1.1rem, 4vw, 2.5rem) !important;
  line-height: 1.35 !important;
}

/* 通用容器响应式内边距 */
.container, .quiz-container, .achievement-card, .fortune-card,
.project-card, .skills-card, .easter-eggs {
  padding-left: clamp(0.5rem, 3vw, 2rem) !important;
  padding-right: clamp(0.5rem, 3vw, 2rem) !important;
  padding-top: clamp(1rem, 4vw, 2rem) !important;
  padding-bottom: clamp(1rem, 4vw, 2rem) !important;
}

/* 卡片响应式圆角 */
.achievement-card, .fortune-card, .quiz-container,
.project-card, .skills-card, .easter-eggs {
  border-radius: clamp(8px, 2vw, 16px) !important;
}

@media (max-width: 768px) {
  .app-theme-toggle {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .intro-avatar-inner {
    width: 100px;
    height: 100px;
    font-size: 2.2rem;
  }
}

@media (max-width: 600px) {
  /* 超小屏幕优化 */
  body {
    font-size: 13px;
  }
  
  /* 成就图鉴专用 */
  .stats-achievement-card {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 0.75rem !important;
    padding: 0.75rem !important;
  }
  
  .card-icon {
    font-size: 2rem !important;
    min-width: auto !important;
  }
  
  .card-info h3 {
    font-size: 1.1rem !important;
  }
  
  .achievement-code, .achievement-desc {
    font-size: 0.75rem !important;
  }
  
  .unlocked-badge, .locked-badge {
    font-size: 0.75rem !important;
    padding: 0.2rem 0.6rem !important;
  }
  
  /* 运势页面 */
  .fortune-header h1 {
    font-size: 1.3rem !important;
  }
  
  .fortune-level {
    font-size: 1.5rem !important;
  }
  
  .fortune-text {
    font-size: 0.95rem !important;
    line-height: 1.5 !important;
  }
  
  .fortune-card {
    padding: 1rem 0.75rem !important;
    border-radius: 20px !important;
  }
}

@media (max-width: 480px) {
  body {
    font-size: 12px;
  }
  
  h1 {
    font-size: 1.3rem !important;
    line-height: 1.25 !important;
  }
  
  h2 {
    font-size: 1.1rem !important;
    line-height: 1.3 !important;
  }

  .app-navbar-inner {
    height: 52px;
  }

  .app-content {
    padding-top: 52px;
  }

  .app-nav-logo {
    font-size: 1.05rem;
  }
  
  /* 按钮全宽 */
  button, .return-button, .back-link, .guestbook-button,
  .reset-button, .screenshot-button {
    width: 100% !important;
    justify-content: center !important;
    padding: 0.75rem !important;
    min-height: 44px !important; /* 触摸友好 */
  }
  
  /* 按钮容器 */
  .button-container, .button-group {
    flex-direction: column !important;
    width: 100% !important;
    gap: 0.5rem !important;
  }
  
  /* 留言墙 */
  .message-input-row {
    flex-direction: column !important;
    gap: 0.5rem !important;
  }
  
  .egg-item {
    gap: 0.5rem !important;
    flex-wrap: wrap !important;
    padding: 0.5rem !important;
  }
  
  .egg-item .secret-message {
    margin-left: 0 !important;
    font-size: 0.85rem !important;
  }
  
  /* 技能条 */
  .skill-item {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.5rem !important;
  }
  
  .skill-bar {
    width: 100% !important;
    height: 6px !important;
  }
  
  /* 输入框优化 */
  input[type="text"],
  input[type="password"] {
    font-size: 16px !important; /* 防止iOS自动缩放 */
    min-height: 44px !important;
  }
}
</style>
