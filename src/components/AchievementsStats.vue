<template>
  <div class="achievements-stats">
    <div v-if="particleCount > 0" class="floating-particles">
      <div v-for="n in particleCount" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>

    <!-- 切换过渡 -->
    <transition name="slide-fade" mode="out-in">
      <!-- 成就详情界面 - 模仿 Achievement_01.vue 风格 -->
      <div
        v-if="selectedAchievement"
        :key="'detail-' + selectedAchievement.id"
        class="achievement-detail-view"
        :style="{ '--ach-color': selectedAchievement.color || '#b082ff' }"
      >
        <div class="detail-bg-rotate"></div>

        <div class="detail-header">
          <div class="detail-stars">
            <span v-for="n in 5" :key="n">⭐</span>
          </div>
          <h1 class="detail-title">🏆 成就详情 🏆</h1>
          <div class="detail-stars">
            <span v-for="n in 5" :key="n">⭐</span>
          </div>
        </div>

        <div class="detail-card" :class="[selectedAchievement.cardClass, { unlocked: selectedAchievement.unlocked }]">
          <div class="detail-shine"></div>

          <div class="detail-icon-wrap">
            <span class="detail-icon">{{ selectedAchievement.unlocked ? selectedAchievement.icon : '🔒' }}</span>
          </div>

          <div class="detail-name-wrap">
            <span class="detail-code-badge">{{ selectedAchievement.code }}</span>
            <h2 class="detail-name">{{ selectedAchievement.unlocked ? selectedAchievement.name : '▓▓▓▓▓▓▓▓' }}</h2>
          </div>

          <div class="detail-divider">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>

          <div class="detail-desc-wrap">
            <p class="detail-congrats">{{ selectedAchievement.unlocked ? '成就描述：' : '尚未解锁成就' }}</p>
            <p class="detail-desc" :class="{ locked: !selectedAchievement.unlocked }">
              {{ selectedAchievement.unlocked ? selectedAchievement.desc : '继续探索，解锁这个隐藏成就吧！' }}
            </p>
          </div>

          <div class="detail-status-wrap">
            <span v-if="selectedAchievement.unlocked" class="detail-status-badge unlocked"> ✅ 已解锁 </span>
            <span v-else class="detail-status-badge locked"> 🔒 未解锁 </span>
          </div>
        </div>

        <div class="detail-footer">
          <button class="return-to-list-btn" @click="goBack">
            <span class="btn-icon">📜</span>
            返回成就列表
          </button>
        </div>
      </div>

      <!-- 成就列表界面 -->
      <div v-else key="list" class="achievements-list-view">
        <div class="stats-header">
          <h1>🏆 成就图鉴 🏆</h1>
          <div class="stats-summary">
            <div class="stat-card">
              <span class="stat-label">已解锁</span>
              <span class="stat-value">{{ unlockedCount }}/{{ totalCount }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">完成度</span>
              <span class="stat-value">{{ completionPercentage }}%</span>
            </div>
          </div>
          <button class="reset-button" @click="resetAchievements" :disabled="isResetting">
            <span class="reset-icon" :class="{ spin: isResetting }">🔄</span>
            {{ isResetting ? '重置中...' : '重置成就' }}
          </button>
        </div>

        <div class="achievements-grid">
          <!-- 普通成就（始终显示，未解锁显示问号） -->
          <div
            v-for="ach in normalAchievements"
            :key="ach.id"
            :class="[
              'stats-achievement-card',
              { unlocked: ach.unlocked, 'not-clickable': !ach.unlocked, shake: ach.shaking, 'red-flash': ach.redFlash },
              ach.cardClass
            ]"
            @click="handleCardClick(ach)"
          >
            <div class="card-icon">{{ ach.unlocked ? ach.icon : '🔒' }}</div>
            <div class="card-info">
              <h3>{{ ach.unlocked ? ach.name : garbledNames[ach.id] || 'ABCD' }}</h3>
              <p class="achievement-code">{{ ach.unlocked ? ach.code : '??_??' }}</p>
              <p class="achievement-desc">{{ ach.unlocked ? ach.desc : garbledDescs[ach.id] || 'desc' }}</p>
              <span
                v-if="ach.unlocked"
                class="unlocked-badge"
                :style="{ color: ach.color, background: `${ach.color}20` }"
                >✅ 已解锁</span
              >
              <span v-else class="locked-badge">❓ 未解锁</span>
            </div>
          </div>

          <!-- 隐藏成就（只显示已解锁的） -->
          <div
            v-for="ach in unlockedHiddenAchievements"
            :key="ach.id"
            :class="['stats-achievement-card unlocked', ach.cardClass]"
            @click="viewAchievement(ach)"
          >
            <div class="card-icon">{{ ach.icon }}</div>
            <div class="card-info">
              <h3>{{ ach.name }}</h3>
              <p class="achievement-code">{{ ach.code }}</p>
              <p class="achievement-desc">{{ ach.desc }}</p>
              <span class="unlocked-badge" :style="{ color: '#ffd700', background: 'rgba(255, 215, 0, 0.2)' }"
                >✅ 已解锁</span
              >
            </div>
          </div>
        </div>

        <div class="button-container">
          <router-link to="/" class="return-button"> <span class="button-icon">🏠</span>回到首页 </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AchievementsStats',
  setup() {
    const router = useRouter()
    // 当前选中的成就
    const selectedAchievement = ref(null)

    // 查看成就详情
    const viewAchievement = (ach) => {
      // 动态检查 localStorage 确保解锁状态正确
      const isUnlocked = localStorage.getItem(ach.id) === 'true'
      if (isUnlocked) {
        // 如果有对应路由，跳转到成就页面
        if (ach.route) {
          router.push(ach.route)
        } else {
          // 否则显示内嵌详情
          selectedAchievement.value = { ...ach, unlocked: true }
        }
      }
    }

    // 处理卡片点击
    const handleCardClick = (ach) => {
      const currentUnlocked = localStorage.getItem(ach.id) === 'true'
      if (currentUnlocked) {
        viewAchievement(ach)
      } else {
        // 未解锁：同时触发抖动和红框闪烁效果
        ach.shaking = true
        ach.redFlash = true
        setTimeout(() => {
          ach.shaking = false
          ach.redFlash = false
        }, 500)

        // 好奇心成就：点击好奇心成就本身15次才能触发
        if (ach.id === 'achieve_curious') {
          const clickCount = parseInt(localStorage.getItem('curious_clicks') || '0') + 1
          localStorage.setItem('curious_clicks', clickCount.toString())

          if (clickCount >= 15) {
            if (localStorage.getItem('achieve_curious') !== 'true') {
              localStorage.setItem('achieve_curious', 'true')
              const curiousAch = normalAchievements.value.find((a) => a.id === 'achieve_curious')
              if (curiousAch) {
                curiousAch.unlocked = true
              }
              router.push('/self/who_i_am/achievement_curious')
            }
          }
        }
      }
    }

    // 返回列表
    const goBack = () => {
      selectedAchievement.value = null
    }

    // 普通成就配置（始终显示，未解锁显示问号）
    const normalAchievements = ref([
      {
        id: 'achieve_idle',
        name: '闲的蛋疼',
        code: 'Achievement_01',
        desc: '在 关于 页面点击按钮50次',
        icon: '🥚',
        color: '#b082ff',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 50 ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'achievement-01-card'
      },
      {
        id: 'achieve_02',
        name: '捣蛋专家',
        code: 'Achievement_02',
        desc: '在 闲的蛋疼 页面点击大逼兜60次',
        icon: '💥',
        color: '#ffd700',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 60 ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'achievement-02-card'
      },
      {
        id: 'achieve_03',
        name: '摸鱼精灵',
        code: 'Achievement_03',
        desc: '在 首页 进度和代码行数都小于40时点击施工精灵',
        icon: '🧚',
        color: '#50ff80',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓ ▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'achievement-03-card'
      },
      {
        id: 'achieve_05',
        name: '鸿运当头',
        code: 'Achievement_05',
        desc: '首次在运势页面抽到大吉',
        icon: '🍀',
        color: '#42b983',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'lucky-strike-card'
      },
      {
        id: 'achieve_06',
        name: '逢凶化吉',
        code: 'Achievement_06',
        desc: '首次在运势页面抽到大凶',
        icon: '⚡',
        color: '#ff9b8c',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'turn-the-tide-card'
      },
      {
        id: 'achieve_curious',
        name: '逆规寻真',
        code: 'Achievement_07',
        desc: '在锁定时点击本成就成就15次',
        icon: '🔍',
        color: '#9b59b6',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'curious-card'
      },
      {
        id: 'achieve_theme_flipper',
        name: '光影穿梭',
        code: 'Achievement_08',
        desc: '反复切换深浅主题20次',
        icon: '🌓',
        color: '#f5a623',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 20 ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'theme-flipper-card',
        route: '/who_i_am/achievement_theme_flipper'
      }
    ])

    const hiddenAchievements = ref([
      {
        id: 'achieve_fate_blessed',
        name: '天命所归',
        code: 'HIDDEN_01',
        desc: '集齐所有运势（大吉、吉、小吉、平、小凶、凶、大凶）',
        icon: '✨',
        color: '#ffd700',
        cardClass: 'fate-blessed-card'
      }
    ])

    // 随机乱码字符 - 字母和符号
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*?!'
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz@#$%&*?!'
    const garbledNames = reactive({})
    const garbledDescs = reactive({})
    const garbledTimers = reactive({})

    // 生成随机乱码 - mode: 'upper'(标题大写), 'lower'(描述小写)
    const generateGarbled = (length, mode) => {
      const chars = mode === 'upper' ? upperChars : lowerChars
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
      return result
    }

    // 更新单个成就的乱码
    const updateGarbled = (id) => {
      const ach = normalAchievements.value.find((a) => a.id === id)
      if (ach && !ach.unlocked) {
        garbledNames[id] = generateGarbled(ach.name.length, 'upper')
        garbledDescs[id] = generateGarbled(ach.desc.length, 'lower')
      }
    }

    // 初始化所有乱码
    const initGarbledNames = () => {
      normalAchievements.value.forEach((ach) => {
        if (!ach.unlocked) {
          garbledNames[ach.id] = generateGarbled(ach.name.length, 'upper')
          garbledDescs[ach.id] = generateGarbled(ach.desc.length, 'lower')
          // 快速随机间隔更新乱码
          const randomInterval = () => {
            updateGarbled(ach.id)
            garbledTimers[ach.id] = setTimeout(randomInterval, 10)
          }
          garbledTimers[ach.id] = setTimeout(randomInterval, Math.random() * 200)
        }
      })
    }

    // 清理定时器
    const clearGarbledTimers = () => {
      Object.keys(garbledTimers).forEach((id) => {
        if (garbledTimers[id]) {
          clearTimeout(garbledTimers[id])
          delete garbledTimers[id]
        }
      })
    }

    // 更新普通成就的解锁状态
    const updateNormalUnlocked = () => {
      clearGarbledTimers()
      normalAchievements.value.forEach((ach) => {
        ach.unlocked = localStorage.getItem(ach.id) === 'true'
      })
      initGarbledNames()
    }

    // 获取已解锁的隐藏成就
    const unlockedHiddenAchievements = computed(() => {
      return hiddenAchievements.value.filter((ach) => localStorage.getItem(ach.id) === 'true')
    })

    // 总成就数 = 普通成就数 + 已解锁的隐藏成就数
    const totalCount = computed(() => {
      return normalAchievements.value.length + unlockedHiddenAchievements.value.length
    })

    // 已解锁数量 = 普通成就中已解锁数 + 已解锁的隐藏成就数
    const unlockedCount = computed(() => {
      const normalUnlocked = normalAchievements.value.filter((ach) => ach.unlocked).length
      return normalUnlocked + unlockedHiddenAchievements.value.length
    })

    const completionPercentage = computed(() => {
      return totalCount.value === 0 ? 0 : Math.floor((unlockedCount.value / totalCount.value) * 100)
    })

    const isResetting = ref(false)

    const particleCount = computed(() => {
      return unlockedCount.value * 15
    })

    const getParticleStyle = (n) => {
      const colors = ['#b082ff', '#ffd700', '#50ff80', '#6ab0ff', '#ff9b8c', '#8a6de9', '#00ffff', '#ffa500']
      const size = Math.floor(Math.random() * 8) + 4
      const left = Math.floor(Math.random() * 100)
      const duration = Math.floor(Math.random() * 15) + 8
      const delay = Math.floor(Math.random() * 8)
      const opacity = Math.random() * 0.3 + 0.3
      return {
        width: size + 'px',
        height: size + 'px',
        left: left + '%',
        backgroundColor: colors[n % colors.length],
        opacity: opacity,
        animation: `float ${duration}s linear ${delay}s infinite`,
        filter: 'blur(1px)'
      }
    }

    const resetAchievements = () => {
      if (confirm('确定要重置所有成就进度吗？')) {
        isResetting.value = true

        // 清除所有成就
        normalAchievements.value.forEach((ach) => localStorage.removeItem(ach.id))
        hiddenAchievements.value.forEach((ach) => localStorage.removeItem(ach.id))

        // 清除好奇心成就的点击计数
        localStorage.removeItem('curious_clicks')
        localStorage.removeItem('curious_last_clicked')

        // 清除主题切换计数
        localStorage.removeItem('theme_flips_count')

        updateNormalUnlocked()

        hiddenAchievements.value = [...hiddenAchievements.value]

        setTimeout(() => {
          isResetting.value = false
        }, 500)
      }
    }
    updateNormalUnlocked()

    return {
      normalAchievements,
      unlockedHiddenAchievements,
      totalCount,
      unlockedCount,
      completionPercentage,
      isResetting,
      particleCount,
      getParticleStyle,
      resetAchievements,
      selectedAchievement,
      viewAchievement,
      goBack,
      handleCardClick,
      garbledNames,
      garbledDescs
    }
  }
}
</script>

<style src="../styles/achievements-stats.css"></style>
