<template>
  <div id="app" :data-theme="effectiveTheme">
    <!-- Toast 全局提示 -->
    <div class="app-toast" :class="{ show: toastVisible }">{{ toastMessage }}</div>

    <!-- 全局导航栏 -->
    <nav class="app-navbar">
      <div class="app-navbar-inner">
        <RouterLink class="app-nav-logo" to="/self">Briandolph Qi</RouterLink>
        <div class="app-nav-actions">
          <div class="app-nav-links"></div>
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
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, provide, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItem, setItem, hasItem } from './utils/storage'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // ===== 路由过渡：成就/解锁页干脆弹入，其余内容页柔和淡入 =====
    const pageTransition = computed(() =>
      route.path.includes('achieve') && route.path !== '/self/achievements' ? 'snap' : 'page'
    )

    // ===== 深浅主题（各页面都可切换） =====
    const theme = ref(getItem('app_theme', 'dark'))
    const effectiveTheme = computed(() => theme.value)
    provide('appTheme', theme)

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
            router.push('/self/who_i_am/achievement_theme_flipper')
          }, 1800)
        }
      }

      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const root = document.documentElement

      // 圆形揭幕：View Transitions 把旧主题作为底、新主题从按钮处用圆窗揭开。
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
      window.removeEventListener('keydown', handleKeydown)
      clearTimeout(toastTimer)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    })

    return {
      pageTransition,
      theme,
      effectiveTheme,
      toggleTheme,
      toastVisible,
      toastMessage
    }
  }
}
</script>

<style src="./styles/app.css"></style>
