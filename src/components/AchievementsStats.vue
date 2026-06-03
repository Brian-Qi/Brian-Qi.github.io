<template>
  <div class="achievements-stats">
    <div v-if="particleCount > 0" class="floating-particles">
      <div v-for="n in particleCount" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>

    <!-- 切换过渡 -->
    <transition name="slide-fade" mode="out-in">

      <!-- 成就详情界面 - 模仿 Achievement_01.vue 风格 -->
      <div v-if="selectedAchievement" :key="'detail-' + selectedAchievement.id"
           class="achievement-detail-view"
           :style="{ '--ach-color': selectedAchievement.color || '#b082ff' }">
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
            <span v-if="selectedAchievement.unlocked" class="detail-status-badge unlocked">
              ✅ 已解锁
            </span>
            <span v-else class="detail-status-badge locked">
              🔒 未解锁
            </span>
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
            <span class="reset-icon" :class="{ 'spin': isResetting }">🔄</span>
            {{ isResetting ? '重置中...' : '重置成就' }}
          </button>
        </div>

        <div class="achievements-grid">
          <!-- 普通成就（始终显示，未解锁显示问号） -->
          <div v-for="ach in normalAchievements" :key="ach.id"
               :class="['stats-achievement-card', { unlocked: ach.unlocked, 'not-clickable': !ach.unlocked, shake: ach.shaking, 'red-flash': ach.redFlash }, ach.cardClass]"
               @click="handleCardClick(ach)">
            <div class="card-icon">{{ ach.unlocked ? ach.icon : '🔒' }}</div>
            <div class="card-info">
              <h3>{{ ach.unlocked ? ach.name : (garbledNames[ach.id] || 'ABCD') }}</h3>
              <p class="achievement-code">{{ ach.unlocked ? ach.code : '??_??' }}</p>
              <p class="achievement-desc">{{ ach.unlocked ? ach.desc : (garbledDescs[ach.id] || 'desc') }}</p>
              <span v-if="ach.unlocked" class="unlocked-badge" :style="{ color: ach.color, background: `${ach.color}20` }">✅ 已解锁</span>
              <span v-else class="locked-badge">❓ 未解锁</span>
            </div>
          </div>

          <!-- 隐藏成就（只显示已解锁的） -->
          <div v-for="ach in unlockedHiddenAchievements" :key="ach.id"
               :class="['stats-achievement-card unlocked', ach.cardClass]"
               @click="viewAchievement(ach)">
            <div class="card-icon">{{ ach.icon }}</div>
            <div class="card-info">
              <h3>{{ ach.name }}</h3>
              <p class="achievement-code">{{ ach.code }}</p>
              <p class="achievement-desc">{{ ach.desc }}</p>
              <span class="unlocked-badge" :style="{ color: '#ffd700', background: 'rgba(255, 215, 0, 0.2)' }">✅ 已解锁</span>
            </div>
          </div>
        </div>

        <div class="button-container">
          <router-link to="/" class="return-button">
            <span class="button-icon">🏠</span>回到首页
          </router-link>
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
              const curiousAch = normalAchievements.value.find(a => a.id === 'achieve_curious')
              if (curiousAch) {
                curiousAch.unlocked = true
              }
              router.push('/who_i_am/achievement_curious')
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
        id: 'achieve_idle', name: '闲的蛋疼', code: 'Achievement_01',
        desc: '在 关于 页面点击按钮50次', icon: '🥚', color: '#b082ff',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 50 ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'achievement-01-card'
      },
      {
        id: 'achieve_02', name: '捣蛋专家', code: 'Achievement_02',
        desc: '在 闲的蛋疼 页面点击大逼兜60次', icon: '💥', color: '#ffd700',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ 60 ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'achievement-02-card'
      },
      {
        id: 'achieve_03', name: '摸鱼精灵', code: 'Achievement_03',
        desc: '在 首页 进度和代码行数都小于40时点击施工精灵', icon: '🧚', color: '#50ff80',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓ ▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'achievement-03-card'
      },
      {
        id: 'achieve_04', name: '最佳损友', code: 'Achievement_04',
        desc: '答对所有题目，获得损友认证', icon: '🤝', color: '#6ab0ff',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'best-friend-card'
      },
      {
        id: 'achieve_05', name: '鸿运当头', code: 'Achievement_05',
        desc: '首次在运势页面抽到大吉', icon: '🍀', color: '#42b983',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'lucky-strike-card'
      },
      {
        id: 'achieve_06', name: '逢凶化吉', code: 'Achievement_06',
        desc: '首次在运势页面抽到大凶', icon: '⚡', color: '#ff9b8c',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'turn-the-tide-card'
      },
      {
        id: 'achieve_curious', name: '逆规寻真', code: 'Achievement_07',
        desc: '在锁定时点击本成就成就15次', icon: '🔍', color: '#9b59b6',
        hiddenDesc: '▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓ ▓▓',
        unlocked: false,
        shaking: false,
        redFlash: false,
        cardClass: 'curious-card'
      },
      {
        id: 'achieve_theme_flipper', name: '光影穿梭', code: 'Achievement_08',
        desc: '反复切换深浅主题20次', icon: '🌓', color: '#f5a623',
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
      },
      { 
        id: 'achieve_music_lover', 
        name: '回到起点', 
        code: 'HIDDEN_02', 
        desc: '从首页返回起点 — Da Capo', 
        icon: '🔁', 
        color: '#C084FC',
        cardClass: 'music-lover-card'
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
      const ach = normalAchievements.value.find(a => a.id === id)
      if (ach && !ach.unlocked) {
        garbledNames[id] = generateGarbled(ach.name.length, 'upper')
        garbledDescs[id] = generateGarbled(ach.desc.length, 'lower')
      }
    }

    // 初始化所有乱码
    const initGarbledNames = () => {
      normalAchievements.value.forEach(ach => {
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
      Object.keys(garbledTimers).forEach(id => {
        if (garbledTimers[id]) {
          clearTimeout(garbledTimers[id])
          delete garbledTimers[id]
        }
      })
    }

    // 更新普通成就的解锁状态
    const updateNormalUnlocked = () => {
      clearGarbledTimers()
      normalAchievements.value.forEach(ach => {
        ach.unlocked = localStorage.getItem(ach.id) === 'true'
      })
      initGarbledNames()
    }

    // 获取已解锁的隐藏成就
    const unlockedHiddenAchievements = computed(() => {
      return hiddenAchievements.value.filter(ach => localStorage.getItem(ach.id) === 'true')
    })

    // 总成就数 = 普通成就数 + 已解锁的隐藏成就数
    const totalCount = computed(() => {
      return normalAchievements.value.length + unlockedHiddenAchievements.value.length
    })

    // 已解锁数量 = 普通成就中已解锁数 + 已解锁的隐藏成就数
    const unlockedCount = computed(() => {
      const normalUnlocked = normalAchievements.value.filter(ach => ach.unlocked).length
      return normalUnlocked + unlockedHiddenAchievements.value.length
    })

    const completionPercentage = computed(() => {
      return totalCount.value === 0 ? 0 : Math.floor(unlockedCount.value / totalCount.value * 100)
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
        normalAchievements.value.forEach(ach => localStorage.removeItem(ach.id))
        hiddenAchievements.value.forEach(ach => localStorage.removeItem(ach.id))
        
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

<style>
/* 故障乱码效果 */
@keyframes glitch {
  0% {
    transform: translate(0);
    opacity: 1;
    text-shadow: none;
  }
  20% {
    transform: translate(-2px, 2px);
    text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
    opacity: 0.9;
  }
  40% {
    transform: translate(2px, -2px);
    text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
    opacity: 0.8;
  }
  60% {
    transform: translate(-2px, -1px);
    text-shadow: 1px 0 #00ff00, -1px 0 #ff0000;
    opacity: 0.9;
  }
  80% {
    transform: translate(1px, 2px);
    text-shadow: -2px 0 #0000ff, 2px 0 #ffff00;
    opacity: 0.8;
  }
  100% {
    transform: translate(0);
    opacity: 1;
    text-shadow: none;
  }
}

/* 未解锁的成就卡片文字添加故障效果 */
.stats-achievement-card:not(.unlocked) h3,
.stats-achievement-card:not(.unlocked) .achievement-code,
.stats-achievement-card:not(.unlocked) .achievement-desc {
  animation: glitch 0.3s infinite;
  color: var(--app-accent-text);
  filter: blur(0.5px);
  opacity: 0.7;
}

/* 未解锁的图标也加点效果 */
.stats-achievement-card:not(.unlocked) .card-icon {
  filter: grayscale(0.5) blur(0.5px);
  opacity: 0.6;
}

/* 已解锁的成就保持正常 */
.stats-achievement-card.unlocked h3,
.stats-achievement-card.unlocked .achievement-code,
.stats-achievement-card.unlocked .achievement-desc {
  animation: none;
  filter: none;
  opacity: 1;
}

/* 成就01：闲的蛋疼 - 紫色边框 */
.stats-achievement-card.unlocked.achievement-01-card {
  border: 2px solid #b082ff;
  box-shadow: 0 0 8px rgba(176, 130, 255, 0.4);
}
.stats-achievement-card.unlocked.achievement-01-card:hover {
  box-shadow: 0 0 15px rgba(176, 130, 255, 0.6);
  transform: translateY(-2px);
}

/* 成就02：捣蛋专家 - 金色边框 */
.stats-achievement-card.unlocked.achievement-02-card {
  border: 2px solid #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}
.stats-achievement-card.unlocked.achievement-02-card:hover {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  transform: translateY(-2px);
}

/* 成就03：摸鱼精灵 - 绿色边框 */
.stats-achievement-card.unlocked.achievement-03-card {
  border: 2px solid #50ff80;
  box-shadow: 0 0 8px rgba(80, 255, 128, 0.4);
}
.stats-achievement-card.unlocked.achievement-03-card:hover {
  box-shadow: 0 0 15px rgba(80, 255, 128, 0.6);
  transform: translateY(-2px);
}

/* 成就04：最佳损友 - 蓝色边框 */
.stats-achievement-card.unlocked.best-friend-card {
  border: 2px solid #6ab0ff;
  box-shadow: 0 0 8px rgba(106, 176, 255, 0.4);
}
.stats-achievement-card.unlocked.best-friend-card:hover {
  box-shadow: 0 0 15px rgba(106, 176, 255, 0.6);
  transform: translateY(-2px);
}

/* 成就05：鸿运当头 - 金色边框 */
.stats-achievement-card.unlocked.lucky-strike-card {
  border: 2px solid #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}
.stats-achievement-card.unlocked.lucky-strike-card:hover {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  transform: translateY(-2px);
}

/* 成就06：逢凶化吉 - 红金色边框 */
.stats-achievement-card.unlocked.turn-the-tide-card {
  border: 2px solid #ff9b8c;
  box-shadow: 0 0 8px rgba(255, 155, 140, 0.4);
}
.stats-achievement-card.unlocked.turn-the-tide-card:hover {
  box-shadow: 0 0 15px rgba(255, 155, 140, 0.6);
  transform: translateY(-2px);
}

/* 成就07：好奇心 - 紫色边框 */
.stats-achievement-card.unlocked.curious-card {
  border: 2px solid #9b59b6;
  box-shadow: 0 0 8px rgba(155, 89, 182, 0.4);
}
.stats-achievement-card.unlocked.curious-card:hover {
  box-shadow: 0 0 15px rgba(155, 89, 182, 0.6);
  transform: translateY(-2px);
}

/* 成就08：光影穿梭 - 暖橙金边框 */
.stats-achievement-card.unlocked.theme-flipper-card {
  border: 2px solid #f5a623;
  box-shadow: 0 0 8px rgba(245, 166, 35, 0.4);
}
.stats-achievement-card.unlocked.theme-flipper-card:hover {
  box-shadow: 0 0 15px rgba(245, 166, 35, 0.6);
  transform: translateY(-2px);
}

/* 隐藏成就：天命所归 - 优雅流光边框 */
.stats-achievement-card.unlocked.fate-blessed-card {
  position: relative;
  background: rgba(25, 30, 35, 0.85);
  border: 2px solid transparent;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 25px rgba(255, 215, 0, 0.3);
  animation: elegantGlow 4s linear infinite;
}

/* 流光边框效果 */
.stats-achievement-card.unlocked.fate-blessed-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 27px;
  background: linear-gradient(
    45deg, 
    #ffd700, #ff6b6b, #42b983, #6ab0ff, #ffd700
  );
  background-size: 300% 300%;
  z-index: -1;
  animation: borderFlow 3s ease infinite;
  opacity: 0.7;
}

/* 内层背景，覆盖渐变形成边框线 */
.stats-achievement-card.unlocked.fate-blessed-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 30, 35, 0.85);
  border-radius: 24px;
  z-index: -1;
}

.stats-achievement-card.unlocked.fate-blessed-card .card-info h3,
.stats-achievement-card.unlocked.fate-blessed-card .achievement-code,
.stats-achievement-card.unlocked.fate-blessed-card .achievement-desc {
  color: #ffd700 !important;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

/* 卡片发光动画 */
@keyframes elegantGlow {
  0%, 100% {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 25px rgba(255, 215, 0, 0.3),
      0 0 35px rgba(255, 107, 107, 0.1);
  }
  33% {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 25px rgba(255, 107, 107, 0.3),
      0 0 35px rgba(66, 185, 131, 0.1);
  }
  66% {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 25px rgba(66, 185, 131, 0.3),
      0 0 35px rgba(106, 176, 255, 0.1);
  }
}

/* 边框流动动画 */
@keyframes borderFlow {
  0% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
  50% {
    background-position: 100% 50%;
    opacity: 0.9;
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
}

/* 悬停效果 */
.stats-achievement-card.unlocked.fate-blessed-card:hover {
  animation-duration: 2s;
  transform: translateY(-2px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.4),
    0 0 35px rgba(255, 215, 0, 0.5),
    0 0 45px rgba(255, 107, 107, 0.2);
}

.stats-achievement-card.unlocked.fate-blessed-card:hover::before {
  opacity: 1;
  animation-duration: 1.5s;
}

/* 隐藏成就：回到起点 - 优雅流光边框 */
.stats-achievement-card.unlocked.music-lover-card {
  position: relative;
  background: rgba(25, 30, 35, 0.85);
  border: 2px solid transparent;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 25px rgba(192, 132, 252, 0.3);
  animation: elegantGlowMusic 4s linear infinite;
}

@keyframes elegantGlowMusic {
  0%, 100% {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 25px rgba(192, 132, 252, 0.3),
      0 0 35px rgba(77, 201, 246, 0.1);
  }
  50% {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 25px rgba(77, 201, 246, 0.3),
      0 0 35px rgba(192, 132, 252, 0.1);
  }
}

.stats-achievement-card.unlocked.music-lover-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 27px;
  background: linear-gradient(
    45deg, 
    #FFFFFF, #4DC9F6, #C084FC, #4DC9F6, #FFFFFF
  );
  background-size: 300% 300%;
  z-index: -1;
  animation: borderFlow 3s ease infinite;
  opacity: 0.7;
}

.stats-achievement-card.unlocked.music-lover-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 30, 35, 0.85);
  border-radius: 24px;
  z-index: -1;
}

.stats-achievement-card.unlocked.music-lover-card .card-info h3,
.stats-achievement-card.unlocked.music-lover-card .achievement-code,
.stats-achievement-card.unlocked.music-lover-card .achievement-desc {
  color: #C084FC !important;
  text-shadow: 0 0 5px rgba(192, 132, 252, 0.3);
}

.stats-achievement-card.unlocked.music-lover-card:hover {
  animation-duration: 2s;
  transform: translateY(-2px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.4),
    0 0 35px rgba(192, 132, 252, 0.5),
    0 0 45px rgba(77, 201, 246, 0.2);
}

.stats-achievement-card.unlocked.music-lover-card:hover::before {
  opacity: 1;
  animation-duration: 1.5s;
}

.achievements-stats {
  min-height: 100vh;
  background: linear-gradient(145deg, var(--app-bg) 0%, var(--app-page-gradient-start) 100%);
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--app-text);
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  transition: background var(--app-transition), color var(--app-transition);
}

/* 漂浮粒子容器 */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 单个粒子 */
.particle {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  filter: blur(1px);
  animation: float linear infinite;
  box-shadow: 0 0 10px currentColor;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-120vh) translateX(30px);
    opacity: 0;
  }
}

.stats-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.stats-header h1 {
  font-size: clamp(1.5rem, 5vw, 3rem); /* 流体字体 */
  background: linear-gradient(135deg, #b082ff, #ffd700, #50ff80, #6ab0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  animation: gradientShift 10s ease infinite;
  background-size: 300% 300%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.stats-summary {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--app-container-bg);
  border: 1px solid var(--app-divider);
  border-radius: 20px;
  padding: 1rem 2rem;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: var(--app-accent-text);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
}

.reset-button {
  background: #2a1f36;
  color: #ff9b8c;
  border: 1px solid #5c3a48;
  border-radius: 40px;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.reset-button:hover {
  background: #3a2f46;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 155, 140, 0.3);
}

.reset-icon {
  font-size: 1.2rem;
}

.reset-icon.spin {
  animation: spin 0.5s ease-in-out;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.reset-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.achievements-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.stats-achievement-card {
  background: var(--app-container-bg);
  backdrop-filter: blur(12px);
  border: 2px solid var(--app-divider);
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
  opacity: 0.7;
}

/* 已解锁的成就卡片更明亮 */
.stats-achievement-card.unlocked {
  opacity: 1;
  background: var(--app-container-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: clamp(2rem, 4vw, 3rem); /* 流体字体 */
  min-width: 60px;
  text-align: center;
}

.card-info {
  flex: 1;
}

.card-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  color: var(--app-text);
}

.achievement-code {
  font-size: 0.8rem;
  color: var(--app-accent-text);
  font-family: monospace;
  margin-bottom: 0.5rem;
}

.achievement-desc {
  font-size: 0.9rem;
  color: var(--app-fun-text);
  margin-bottom: 1rem;
}

.unlocked-badge {
  font-weight: bold;
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.locked-badge {
  color: var(--app-accent-text);
  font-weight: bold;
  display: inline-block;
  padding: 0.3rem 1rem;
  background: rgba(143, 158, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.return-button {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--app-btn-secondary-bg);
  color: var(--app-accent-green-text);
  border: 1px solid var(--app-divider);
  transition: all 0.3s ease;
}

.return-button:hover {
  background: var(--app-btn-secondary-hover);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
}

@media (max-width: 768px) {
  .stats-container {
    padding: 1rem !important;
  }
  
  .stats-header h1 {
    font-size: 2rem !important;
    margin-bottom: 1rem !important;
  }
  
  .stats-summary {
    flex-direction: column !important;
    gap: 0.75rem !important;
    margin-bottom: 1.5rem !important;
  }
  
  .stats-card {
    padding: 1rem !important;
  }
  
  .stats-number {
    font-size: 1.5rem !important;
  }
  
  .card-icon {
    font-size: 2rem !important;
    min-width: 50px !important;
  }
  
  .card-info h3 {
    font-size: 1.1rem !important;
  }
  
  .achievement-code {
    font-size: 0.8rem !important;
  }
}

@media (max-width: 600px) {
  .stats-header h1 {
    font-size: 1.5rem !important;
  }
  
  .stats-achievement-card {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 0.5rem !important;
    padding: 0.75rem !important;
  }
  
  .stats-number {
    font-size: 1.25rem !important;
  }
  
  .card-icon {
    font-size: 1.75rem !important;
    margin-bottom: 0.25rem !important;
  }
  
  .card-info h3 {
    font-size: 1rem !important;
    margin-bottom: 0.25rem !important;
  }
  
  .achievement-desc {
    font-size: 0.75rem !important;
    line-height: 1.4 !important;
  }
  
  .unlocked-badge, .locked-badge {
    font-size: 0.7rem !important;
    padding: 0.15rem 0.5rem !important;
  }
}

@media (max-width: 480px) {
  .stats-header h1 {
    font-size: 1.3rem !important;
  }
  
  .stats-achievement-card {
    padding: 0.5rem !important;
  }
  
  .card-icon {
    font-size: 1.5rem !important;
  }
  
  .card-info h3 {
    font-size: 0.9rem !important;
  }
  
  .achievement-desc {
    font-size: 0.7rem !important;
  }
}

@media (max-width: 375px) {
  .stats-header h1 {
    font-size: 1.1rem !important;
  }
  
  .stats-card {
    padding: 0.75rem !important;
  }
  
  .stats-number {
    font-size: 1.1rem !important;
  }
}

/* ========== 切换过渡动画 ========== */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* ========== 成就详情界面 ========== */
.achievement-detail-view {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.detail-bg-rotate {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle at center,
    rgba(180, 130, 255, 0.15) 0%,
    rgba(140, 90, 255, 0.1) 30%,
    transparent 70%);
  transform: translate(-50%, -50%);
  animation: rotateBg 30s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes rotateBg {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.detail-stars {
  display: flex;
  gap: 0.3rem;
  font-size: 1.5rem;
  animation: twinkle 2s infinite alternate;
}

@keyframes twinkle {
  from { opacity: 0.5; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1.1); }
}

.detail-title {
  font-size: 2rem;
  background: linear-gradient(135deg, var(--ach-color), color-mix(in srgb, var(--ach-color) 70%, white));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(180, 130, 255, 0.3);
}

.detail-card {
  max-width: 600px;
  width: 100%;
  background: rgba(30, 20, 45, 0.8);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(180, 130, 255, 0.3);
  border-radius: 48px;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8),
              0 0 30px rgba(180, 130, 255, 0.2);
  animation: cardFloat 3s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.detail-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shineMove 3s infinite;
}

@keyframes shineMove {
  to { left: 150%; }
}

.detail-icon-wrap {
  font-size: 6rem;
  text-align: center;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(180, 130, 255, 0.5));
  animation: iconBounce 2s infinite;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-icon {
  display: inline-block;
  font-size: 4rem;
  transition: all 0.3s ease;
}

@keyframes iconBounce {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.detail-name-wrap {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-code-badge {
  font-size: 0.9rem;
  color: var(--ach-color);
  background: rgba(42, 31, 58, 0.8);
  padding: 0.2rem 1rem;
  border-radius: 40px;
  letter-spacing: 1px;
  font-family: monospace;
  display: inline-block;
  margin-bottom: 1rem;
}

.detail-name {
  font-size: 3rem;
  background: linear-gradient(135deg, #fff, var(--ach-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0.5rem 0;
}

.detail-divider {
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: var(--ach-color);
  font-size: 1.2rem;
  margin: 1.5rem 0;
}

.detail-desc-wrap {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-congrats {
  font-size: 1.2rem;
  color: var(--app-fun-text);
  margin-bottom: 0.5rem;
}

.detail-desc {
  font-size: 1.3rem;
  color: var(--ach-color);
  font-weight: bold;
  text-shadow: 0 0 20px currentColor;
  margin: 1rem 0;
}

.detail-desc.locked {
  color: var(--app-accent-text);
  text-shadow: none;
  font-size: 1rem;
  font-weight: normal;
}

.detail-status-wrap {
  margin-top: 1rem;
  text-align: center;
}

.detail-status-badge {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
}

.detail-status-badge.unlocked {
  color: #50ff80;
  background: rgba(80, 255, 128, 0.2);
  box-shadow: 0 0 25px rgba(80, 255, 128, 0.4);
  animation: statusGlow 2s ease-in-out infinite;
}

@keyframes statusGlow {
  0%, 100% { box-shadow: 0 0 25px rgba(80, 255, 128, 0.4); }
  50% { box-shadow: 0 0 35px rgba(80, 255, 128, 0.6); }
}

.detail-status-badge.locked {
  color: var(--app-accent-text);
  background: rgba(143, 158, 255, 0.15);
  border: 1px solid rgba(143, 158, 255, 0.3);
}

.detail-footer {
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.return-to-list-btn {
  background: linear-gradient(145deg, #2a1f3a, #1a0f2a);
  color: var(--ach-color);
  border: 1px solid var(--ach-color);
  border-radius: 40px;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 0 20px rgba(180, 130, 255, 0.2);
}

.return-to-list-btn:hover {
  background: linear-gradient(145deg, #3a2f5a, #2a1f4a);
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(180, 130, 255, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 不同成就卡片的详情样式 */
.detail-card.achievement-01-card {
  border-color: #b082ff;
  --ach-color: #b082ff;
}

.detail-card.achievement-02-card {
  border-color: #ffd700;
  --ach-color: #ffd700;
}

.detail-card.achievement-03-card {
  border-color: #50ff80;
  --ach-color: #50ff80;
}

.detail-card.best-friend-card {
  border-color: #6ab0ff;
  --ach-color: #6ab0ff;
}

.detail-card.lucky-strike-card {
  border-color: #ffd700;
  --ach-color: #ffd700;
}

.detail-card.turn-the-tide-card {
  border-color: #ff9b8c;
  --ach-color: #ff9b8c;
}

.detail-card.curious-card {
  border-color: #9b59b6;
  --ach-color: #9b59b6;
}

.detail-card.theme-flipper-card {
  border-color: #f5a623;
  --ach-color: #f5a623;
}

.detail-card.fate-blessed-card {
  border: 2px solid transparent;
  background: rgba(25, 30, 35, 0.85);
  --ach-color: #ffd700;
}

.detail-card.fate-blessed-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50px;
  background: linear-gradient(
    45deg,
    #ffd700, #ff6b6b, #42b983, #6ab0ff, #ffd700
  );
  background-size: 300% 300%;
  z-index: -1;
  animation: borderFlow 3s ease infinite;
  opacity: 0.8;
}

.detail-card.fate-blessed-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 30, 35, 0.9);
  border-radius: 48px;
  z-index: -1;
}

.detail-card.fate-blessed-card .detail-name,
.detail-card.fate-blessed-card .detail-code-badge {
  color: #ffd700 !important;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.detail-card.music-lover-card {
  border: 2px solid transparent;
  background: rgba(25, 30, 35, 0.85);
  --ach-color: #C084FC;
}

.detail-card.music-lover-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50px;
  background: linear-gradient(
    45deg,
    #FFFFFF, #4DC9F6, #C084FC, #4DC9F6, #FFFFFF
  );
  background-size: 300% 300%;
  z-index: -1;
  animation: borderFlow 3s ease infinite;
  opacity: 0.8;
}

.detail-card.music-lover-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 30, 35, 0.9);
  border-radius: 48px;
  z-index: -1;
}

.detail-card.music-lover-card .detail-name,
.detail-card.music-lover-card .detail-code-badge {
  color: #C084FC !important;
  text-shadow: 0 0 10px rgba(192, 132, 252, 0.5);
}

/* 成就卡片可点击样式 */
.stats-achievement-card {
  cursor: pointer;
  transition: border-color 0.1s, box-shadow 0.1s, background 0.1s;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.stats-achievement-card:hover {
  transform: translateY(-3px);
}

/* 未解锁成就不可点击 */
.stats-achievement-card.not-clickable {
  cursor: not-allowed;
}

.stats-achievement-card.not-clickable:hover {
  transform: translateY(-3px);
}

.stats-achievement-card.not-clickable.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) translateY(-3px); }
  10% { transform: translateX(-8px) translateY(-3px); }
  20% { transform: translateX(8px) translateY(-3px); }
  30% { transform: translateX(-8px) translateY(-3px); }
  40% { transform: translateX(8px) translateY(-3px); }
  50% { transform: translateX(-5px) translateY(-3px); }
  60% { transform: translateX(5px) translateY(-3px); }
  70% { transform: translateX(-3px) translateY(-3px); }
  80% { transform: translateX(3px) translateY(-3px); }
  90% { transform: translateX(-1px) translateY(-3px); }
}

/* 组合抖动+闪红 */
@keyframes redPulse {
  0%, 100% { 
    box-shadow: none;
    border: 2px solid var(--app-divider);
  }
  15%, 45%, 75% { 
    box-shadow: 0 0 15px 3px rgba(255, 50, 50, 0.6);
    border: 2px solid #ff4444;
  }
  30%, 60% { 
    box-shadow: none;
    border: 2px solid var(--app-divider);
  }
}

.stats-achievement-card.red-flash {
  animation: shake 0.5s ease-in-out, redPulse 0.5s ease-in-out !important;
}

.stats-achievement-card.red-flash .card-info h3,
.stats-achievement-card.red-flash .achievement-desc {
  color: #ff6666 !important;
  text-shadow: 0 0 8px rgba(255, 100, 100, 0.8) !important;
}

/* 未解锁锁图标变灰 */
.stats-achievement-card:not(.unlocked) .card-icon {
  filter: grayscale(100%);
  opacity: 0.6;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .achievement-detail-view {
    padding: 1rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-card {
    padding: 2rem 1.5rem;
    border-radius: 32px;
  }

  .detail-name {
    font-size: 2rem;
  }

  .detail-desc {
    font-size: 1rem;
  }

  .detail-icon-wrap {
    font-size: 4rem;
    min-height: 80px;
  }

  .detail-icon {
    font-size: 3rem;
  }
}

/* ========== 文本换行保护 ========== */
.stats-achievement-card,
.card-info h3,
.achievement-desc,
.achievement-code {
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  word-break: break-word !important;
}

.long-text {
  word-break: break-all !important;
}

.no-wrap {
  white-space: nowrap !important;
}
</style>