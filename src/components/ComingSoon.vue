<template>
  <div class="coming-soon">
    <div v-if="showDialog" class="custom-dialog" @click.self="showDialog = false">
      <div class="dialog-content">
        <div class="dialog-message">{{ dialogMessage }}</div>
        <button class="dialog-button" @click="showDialog = false">知道啦</button>
      </div>
    </div>

    <div class="container">
      <div class="main-message">
        <h1>
          <router-link to="/self/who_i_am" class="name-link">
            <span class="name-highlight">Briandolph Qi</span>
          </router-link>
          <span class="h1-plain">的私人网站</span>
        </h1>
        <div class="status-tag">⏳ 目前仍在开发中 · 悄然生长</div>
      </div>

      <div class="fun-section">
        <div class="whimsy-text"><span>⚠️</span> 这里没有 404 <span>🚧</span></div>
        <h2 class="face face-medium" @click="goToAchievements">Ciallo～(∠・ω&lt; )⌒★</h2>
        <p class="fun-line">
          正在用<span class="glow-dot"></span><span class="glow-dot"></span><span class="glow-dot"></span>和<span
            class="coffee-badge"
            >☕</span
          >搭建宇宙
        </p>
        <div class="construction-quote" @click="checkAchievement">
          <span>🧙‍♂️</span> 施工精灵说："再写{{ tmp_line }}行代码就能跑起来...大概"
        </div>
      </div>

      <div class="progress-area">
        <div class="progress-bar-bg">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="eta-message">
          <span><i>📦</i> 页面装修进度 {{ progress }}%</span>
          <span><i>⏱️</i> 还差好多好多个深夜</span>
        </div>
      </div>

      <div class="construction-zone">
        <div><span class="emoji-big">🛸</span> 正在调试虫洞</div>
        <div><span class="emoji-big">🤖</span> 与 AI 斗嘴中</div>
        <div><span class="emoji-big">🧪</span> 锟斤拷烫烫烫</div>
      </div>

      <a href="#" class="easter-egg" @click.prevent="goToIndex">
        没有找到index.html？别慌，也许它在 <span class="mono">✨平行宇宙✨</span> 里
        <div class="version-tag">vue static · dark mode · 开发秘境 · v0.0.1-alpha.0</div>
      </a>
    </div>
  </div>
</template>

<script>
import { ref, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ComingSoon',
  setup() {
    const router = useRouter()
    const showDialog = ref(false)
    const dialogMessage = ref('')
    const randomProgress = Math.floor(Math.random() * 41) + 30
    const progress = ref(randomProgress)
    const randomtmpline = Math.floor(Math.random() * 80) + 20
    const tmp_line = ref(randomtmpline)

    const checkAchievement = () => {
      if (tmp_line.value < 40 && progress.value < 40) {
        router.push('/self/achieve_slacking')
      } else {
        const messages = [
          '🧙‍♂️\n怎么了怎么了 ⊙ω⊙',
          '🧙‍♂️\n才没有在摸鱼呢 (￣ω￣;)',
          '🧙‍♂️\n那个...再写点代码吧...\n(⁄ ⁄•⁄ω⁄•⁄ ⁄)',
          '🧙‍♂️\n施工中，勿扰！ (・_・)',
          '🧙‍♂️\n被发现了...其实还差一点 (◡‿◡✿)'
        ]
        dialogMessage.value = messages[Math.floor(Math.random() * messages.length)]
        showDialog.value = true
      }
    }

    const goToAchievements = () => {
      router.push('/self/achievements')
    }

    // 从 ComingSoon 进入：先渲染遮罩覆盖当前页，再切路由
    const triggerIntroOverlay = inject('triggerIntroOverlay')
    const goToIndex = async () => {
      triggerIntroOverlay() // 遮罩立即开始进入动画
      await nextTick() // 等 Vue 完成遮罩 DOM 挂载
      router.push('/self') // 切路由，ComingSoon 在遮罩下退出
    }

    return {
      tmp_line,
      progress,
      showDialog,
      dialogMessage,
      checkAchievement,
      goToAchievements,
      goToIndex
    }
  }
}
</script>

<style scoped lang="scss" src="../styles/coming-soon.scss"></style>
