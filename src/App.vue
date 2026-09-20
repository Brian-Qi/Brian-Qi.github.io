<template>
  <div
    id="app"
    :data-theme="effectiveTheme"
    :class="{ 'intro-mode': !isIntroDone && (isHomeRoute || introOverlayVisible) }"
  >
    <!-- Toast 全局提示 -->
    <div class="app-toast" :class="{ show: toastVisible }">{{ toastMessage }}</div>

    <!-- 全局导航栏 -->
    <nav class="app-navbar">
      <div class="app-navbar-inner">
        <span class="app-nav-logo">Briandolph Qi</span>
        <div class="app-nav-actions">
          <button
            class="app-theme-toggle"
            :class="{ 'is-night': theme === 'dark' }"
            @click="toggleTheme"
            :title="theme === 'dark' ? '切换到白天' : '切换到夜晚'"
            :aria-label="theme === 'dark' ? '切换到白天' : '切换到夜晚'"
          >
            <span class="tt-track">
              <span class="tt-sky tt-day"></span>
              <span class="tt-sky tt-night">
                <i class="tt-star"></i><i class="tt-star"></i><i class="tt-star"></i> <i class="tt-star"></i
                ><i class="tt-star"></i>
              </span>
              <span class="tt-knob">
                <span class="tt-sun"></span>
                <span class="tt-moon"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <transition :name="pageTransition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 入场动画遮罩 — 独立于路由，ComingSoon 点击后即覆盖，再切路由 -->
    <Transition name="intro-out" @after-leave="isIntroDone = true">
      <div v-if="introOverlayVisible" class="intro-overlay" @click.stop>
        <div class="intro-noise"></div>
        <canvas ref="particleCanvas" class="intro-canvas"></canvas>
        <div class="intro-avatar-wrapper" @click.stop="onIntroClick">
          <div class="intro-avatar-box">
            <div class="intro-avatar-ring"></div>
            <div class="intro-avatar-inner"><img :src="avatar" alt="" /></div>
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
import avatar from '@/assets/avatar.webp'

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
  function onResize() {
    resize()
  }

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
            const nearMouse =
              Math.min(Math.sqrt(mx1 * mx1 + my1 * my1), Math.sqrt(mx2 * mx2 + my2 * my2)) < MOUSE_RADIUS

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
        p.vx += (Math.random() - 0.5) * 0.1
        p.vy += (Math.random() - 0.5) * 0.1 - 0.004
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
  setup() {
    const route = useRoute()
    const router = useRouter()

    // ===== 首页路由判定（用于入场遮罩触发） =====
    const isHomeRoute = computed(() => route.path === '/index')

    // ===== 路由过渡：成就/解锁页干脆弹入，其余内容页柔和淡入 =====
    const pageTransition = computed(() =>
      route.path.includes('achieve') && route.path !== '/achievements' ? 'snap' : 'page'
    )

    // ===== 深浅主题（各页面都可切换） =====
    const theme = ref(getItem('app_theme', 'dark'))
    const effectiveTheme = computed(() => theme.value)
    function toggleTheme(e) {
      const rect = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40
      const y = rect ? rect.top + rect.height / 2 : 40

      const apply = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        setItem('app_theme', theme.value)

        // 主题切换计数 & 成就检测
        const KEY = 'theme_flips_count'
        const count = parseInt(localStorage.getItem(KEY) || '0') + 1
        localStorage.setItem(KEY, count.toString())
        if (count >= 20 && !hasItem('achieve_theme_flipper')) {
          setItem('achieve_theme_flipper', true)
          showToast('🏆 成就解锁：光影穿梭！')
          setTimeout(() => {
            router.push('/who_i_am/achievement_theme_flipper')
          }, 1800)
        }
      }

      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = document.documentElement

      // 圆形揭幕：View Transitions 把旧主题作为底、新主题从按钮处用圆窗揭开。
      // 内容全程都在（不是盖住再露出），所以不会有「啪」的跳变。
      if (!reduce && typeof document.startViewTransition === 'function') {
        root.style.setProperty('--tx', x + 'px')
        root.style.setProperty('--ty', y + 'px')
        root.classList.add('vt-theme')
        const vt = document.startViewTransition(async () => {
          apply()
          await nextTick()
        })
        vt.finished.finally(() => root.classList.remove('vt-theme'))
      } else {
        apply()
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
    }

    // 路由守卫：会话内只弹一次
    const removeGuard = router.beforeEach((to) => {
      if (to.path === '/index' && !_introDismissed) {
        introOverlayVisible.value = true
      }
    })

    // 提供给子组件使用
    provide('showToast', showToast)

    // ===== 主题同步到 body =====
    function applyThemeToBody(t) {
      const isLight = t === 'light'
      document.body.style.backgroundColor = isLight ? '#f5f7fa' : '#0a0c0f'
      document.body.style.color = isLight ? '#2c3e50' : '#e2e8f0'
      document.body.style.transition =
        'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }

    watch(
      effectiveTheme,
      (newTheme) => {
        applyThemeToBody(newTheme)
      },
      { immediate: true }
    )

    // ===== 键盘快捷键 =====
    function handleKeydown(e) {
      if (e.key === 't' && e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        toggleTheme()
      }
    }

    // ===== 全局允许纵向滚动 =====
    // 页面多为“满屏”设计，屏幕偏矮（小笔记本 / 系统缩放 125%+）或浏览器缩小窗口时，
    // 内容会高于视口；此前一律 overflow:hidden 会把底部裁掉且用户无法滚动，故不再禁用。
    watch(
      () => route.path,
      () => {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      },
      { immediate: true }
    )

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      removeGuard()
      window.removeEventListener('keydown', handleKeydown)
      clearTimeout(toastTimer)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    })

    return {
      avatar,
      pageTransition,
      particleCanvas,
      theme,
      effectiveTheme,
      isHomeRoute,
      isIntroDone,
      introOverlayVisible,
      onIntroClick,
      toggleTheme,
      toastVisible,
      toastMessage
    }
  }
}
</script>

<style src="./styles/app.css"></style>
