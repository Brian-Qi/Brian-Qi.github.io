<template>
  <div class="run-game">
    <!-- 冒险日志面板 - 移动到最外层，固定在浏览器窗口右上角 -->
    <div class="log-panel" :class="{ 'log-expanded': showLog }">
      <div class="log-header" @click="showLog = !showLog">
        <span class="log-icon">📜</span>
        <span>冒险日志</span>
        <span class="log-toggle">{{ showLog ? '▼' : '▶' }}</span>
      </div>
        <div v-show="showLog" class="log-content">
          <div class="log-text" v-html="formattedLogText"></div>
        </div>
    </div>

    <div class="game-container">
      <!-- 游戏主内容 -->
      <div class="game-content">
        <h2 class="story-title">{{ currentNode.title }}</h2>
        <div class="story-text-wrapper">
          <div class="story-text" v-html="displayText"></div>
          <span v-if="isTyping" class="typing-cursor">|</span>
        </div>
        
        <!-- 选项按钮 - 打字机结束后才显示 -->
        <transition name="fade-slide">
          <div v-if="!isTyping && !gameEnded" class="options">
            <button 
              v-for="(opt, idx) in currentNode.options" 
              :key="idx"
              class="option-btn"
              @click="makeChoice(opt)"
            >
              {{ opt.text }}
            </button>
          </div>
          <div v-else-if="!isTyping && gameEnded" class="end-message">
            <p>✨ 旅程结束 ✨</p>
            <button class="reset-btn" @click="resetGame">重新开始</button>
          </div>
          <div v-else class="typing-placeholder">
            <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </div>
        </transition>

        <!-- 属性显示 -->
        <transition name="fade">
          <div class="stats" v-if="stats">
            <span>🧠 意志: {{ stats.will }}</span>
            <span>👁️ 洞察: {{ stats.insight }}</span>
          </div>
        </transition>

        <!-- 物品显示 -->
        <transition name="fade">
          <div class="items" v-if="inventory.length">
            📦 物品: {{ inventory.join(', ') }}
          </div>
        </transition>
      </div>

      <!-- 按钮组 -->
      <div class="action-buttons">
        <button class="back-btn" @click="showBackConfirm">← 返回</button>
        <button class="reset-btn" @click="resetGame">🔄 重开</button>
      </div>
    </div>

    <!-- 返回确认弹窗 -->
    <div v-if="showBackDialog" class="dialog-overlay" @click.self="showBackDialog = false">
      <div class="dialog-content">
        <h3>⚠️ 确认返回</h3>
        <p>返回后当前进度将不会保存，确定要离开吗？</p>
        <div class="dialog-buttons">
          <button @click="showBackDialog = false" class="dialog-btn cancel">继续游戏</button>
          <button @click="confirmBack" class="dialog-btn confirm">确认返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RunGameTheLostRealm',
  setup() {
    const router = useRouter()
    const currentNode = ref({})
    const stats = ref(null)
    const inventory = ref([])
    const gameEnded = ref(false)
    const voidCount = ref(0)
    const showBackDialog = ref(false)
    const showLog = ref(true)
    
    // 冒险日志文本
    const logText = ref('')
    
    // 重新格式化日志分隔符以适应当前面板宽度
    const reformatLogSeparators = () => {
      if (!logText.value) return
      
      // 计算当前合适的分隔符长度
      const calculateSeparatorLength = () => {
        const panelWidth = showLog.value ? 350 : 300
        // 与addLogEntry保持一致的算法
        const availableWidth = panelWidth - 44
        const charsPerLine = Math.floor(availableWidth / 8)
        return Math.max(20, Math.min(charsPerLine, 50))
      }
      
      const newSeparatorLength = calculateSeparatorLength()
      const newSeparator = '='.repeat(newSeparatorLength)
      
      // 替换所有旧的分隔符
      // 匹配以等号开头的行（可能包含空格）
      const lines = logText.value.split('\n')
      const reformattedLines = lines.map(line => {
        if (line.trim().match(/^=+$/)) {
          return newSeparator
        }
        return line
      })
      
      logText.value = reformattedLines.join('\n')
    }
    
    // 监听showLog变化，自动重新格式化分隔符
    watch(showLog, () => {
      setTimeout(reformatLogSeparators, 100)
    })
    
    // 打字机效果相关
    const displayText = ref('')
    const isTyping = ref(false)
    let typingTimer = null

    // 添加日志条目
    const addLogEntry = (title, desc, choice = null) => {
      // 动态计算分隔符长度，适应窗口宽度
      const calculateSeparatorLength = () => {
        // 根据日志面板是否展开决定宽度
        const panelWidth = showLog.value ? 350 : 300
        // 基于字体大小(0.75rem ≈ 12px)计算合适长度
        // 每个等号大约占8px宽度，减去左右padding各20px，再额外减4px留边距
        const availableWidth = panelWidth - 44
        const charsPerLine = Math.floor(availableWidth / 8)
        return Math.max(20, Math.min(charsPerLine, 50)) // 限制在20-50之间
      }
      
      const separatorLength = calculateSeparatorLength()
      const separator = '='.repeat(separatorLength)
      
      let entry = ''
      
      if (choice) {
        // 玩家选择：不加等号，直接显示选择
        entry += '你的选择：' + choice + '\n\n'
      } else if (title && desc) {
        // 场景描述：显示分隔符、标题和描述
        entry += separator + '\n'
        entry += title + '\n'
        entry += desc + '\n'
        entry += separator + '\n\n'
      } else if (desc) {
        // 只有描述的情况
        entry += separator + '\n'
        entry += desc + '\n'
        entry += separator + '\n\n'
      }
      
      logText.value += entry
      // 自动滚动到底部
      setTimeout(() => {
        const logContent = document.querySelector('.log-content')
        if (logContent) logContent.scrollTop = logContent.scrollHeight
      }, 50)
    }

    // 游戏数据
    const story = {
      'start': {
        id: 'start',
        title: '灰色海滩',
        desc: '你在灰色的海滩上醒来，海水是铅灰色的，天空也是。你记得自己是谁，但想不起来为什么会在这里。面前只有两条路：左边的沙滩，右边的枯树林。',
        options: [
          { text: '🏖️ 沿沙滩走', next: 'beach', logChoice: '沿沙滩走去' },
          { text: '🌲 进入枯林', next: 'forest', logChoice: '进入枯林' }
        ]
      },
      'beach': {
        id: 'beach',
        title: '搁浅之物',
        desc: '沙滩上有什么东西被冲了上来。走近看，是一枚旧怀表，表盘已经不动了。背面刻着一行模糊的字："给______，别忘了我。"',
        options: [
          { text: '📿 捡起怀表', next: 'crossroad', action: 'getWatch', logChoice: '捡起怀表' },
          { text: '🚶 继续走', next: 'crossroad', logChoice: '继续走，没有捡起怀表' }
        ]
      },
      'forest': {
        id: 'forest',
        title: '无声森林',
        desc: '树木是灰色的，没有叶子，只有枝干。越往里走，声音越少。深处似乎有座木屋。',
        options: [
          { text: '🏠 去树屋看看', next: 'treehouse', condition: 'will', value: 1, logChoice: '前往树屋' },
          { text: '🌳 继续深入', next: 'lost', logChoice: '继续深入森林' },
          { text: '😞 放弃，回头', next: 'void_path', logChoice: '选择放弃，回头' }
        ]
      },
      'treehouse': {
        id: 'treehouse',
        title: '树屋',
        desc: '树屋里有一面镜子。镜子里映出的不是你，而是另一个人。他看着你，不说话，但你知道他在问：要留下吗？',
        options: [
          { text: '💔 留下', next: 'ending_stay', logChoice: '选择留下' },
          { text: '🚪 离开', next: 'crossroad', logChoice: '离开树屋' }
        ]
      },
      'crossroad': {
        id: 'crossroad',
        title: '岔路口',
        desc: '路在这里分成两条。一条通往海边，一条通往森林深处。',
        options: [
          { text: '🌊 回海边看看', next: 'tide', logChoice: '返回海边' },
          { text: '🌲 进森林', next: 'forest', logChoice: '进入森林' }
        ]
      },
      'tide': {
        id: 'tide',
        title: '潮汐线',
        desc: '海水退去，沙滩上露出一行字："你的名字是______"。你盯着那行字，感觉有什么东西从记忆深处浮上来。',
        options: [
          { text: '💭 想起名字', next: 'ending_return', condition: 'insight', value: 1, action: 'rememberName', logChoice: '想起了自己的名字' },
          { text: '😵 想不起来', next: 'ending_half', action: 'halfRemember', logChoice: '什么也想不起来' }
        ]
      },
      'lost': {
        id: 'lost',
        title: '迷失',
        desc: '你在森林里走了太久，开始忘记自己是谁。树根悄悄缠上你的脚踝。',
        options: [
          { text: '🏃 挣扎', next: 'ending_erosion', action: 'struggle', logChoice: '挣扎着想要逃脱' }
        ]
      },
      'void_path': {
        id: 'void_path',
        title: '放弃',
        desc: '你选择了放弃。没有继续前进，也没有回头。只是站在原地。\n\n时间慢慢流逝，你的轮廓开始模糊。',
        options: [
          { text: '......', next: 'void_confirm', logChoice: '沉默地站在原地' }
        ]
      },
      'void_confirm': {
        id: 'void_confirm',
        title: '消逝',
        desc: '你真的要放弃一切吗？记忆、名字、还有回去的路？',
        options: [
          { text: '😞 放弃', next: 'ending_void', action: 'void', logChoice: '放弃了一切' },
          { text: '💪 不，我要回去', next: 'start', logChoice: '选择继续前进' }
        ]
      },
      'ending_return': {
        id: 'ending_return',
        title: '✨ 回归 ✨',
        desc: '你想起了自己的名字。海面上突然出现一道光，那是来时的路。你握紧怀表，走了出去。\n\n工位上的屏幕还亮着，时间只过了三分钟。没有人知道你去了哪里。\n\n【结局：回归】',
        options: [],
        isEnding: true,
        ending: '回归'
      },
      'ending_half': {
        id: 'ending_half',
        title: '🌫️ 半醒 🌫️',
        desc: '你走出了这片空间，但总觉得心里少了一块。\n\n怀表还在，名字还记得，但有些东西永远留在了那片灰色海滩。\n\n【结局：半醒】',
        options: [],
        isEnding: true,
        ending: '半醒'
      },
      'ending_stay': {
        id: 'ending_stay',
        title: '🏠 滞留 🏠',
        desc: '你留在了树屋里。镜中的人笑了，他说他等了好久，终于有人愿意留下。\n\n窗外是永远灰色的海，但你们可以一起看。\n\n【结局：滞留】',
        options: [],
        isEnding: true,
        ending: '滞留'
      },
      'ending_erosion': {
        id: 'ending_erosion',
        title: '🌳 侵蚀 🌳',
        desc: '你没有挣脱。树根慢慢缠住你的身体，你的皮肤变成树皮，手臂变成枝干。\n\n你成为森林里的又一棵树，风吹过的时候会沙沙响。\n\n【结局：侵蚀】',
        options: [],
        isEnding: true,
        ending: '侵蚀'
      },
      'ending_void': {
        id: 'ending_void',
        title: '💀 虚无 💀',
        desc: '你拒绝了所有的记忆和真相。最终，出口不是回归，而是彻底的虚无。\n\n你的存在被从所有时空中抹除，仿佛从未存在过。\n\n【结局：虚无】',
        options: [],
        isEnding: true,
        ending: '虚无'
      }
    }

    // 打字机效果
    const startTyping = (text) => {
      if (typingTimer) clearInterval(typingTimer)
      displayText.value = ''
      isTyping.value = true
      
      let i = 0
      typingTimer = setInterval(() => {
        if (i < text.length) {
          displayText.value += text[i]
          i++
        } else {
          clearInterval(typingTimer)
          isTyping.value = false
        }
      }, 60)
    }

    // 切换到新节点
    const changeNode = (node) => {
      currentNode.value = node
      startTyping(node.desc)
      
      // 添加场景描述到日志
      if (node.title && node.desc && node.id !== 'start') {
        addLogEntry(node.title, node.desc, null)
      }
    }

    // 初始化游戏
    const initGame = () => {
      const rand = Math.floor(Math.random() * 20) + 1
      let will = 1
      let insight = 1
      if (rand <= 7) { will = 2; insight = 1 }
      else if (rand <= 14) { will = 1; insight = 2 }
      else { will = 2; insight = 2 }
      
      stats.value = { will, insight }
      inventory.value = []
      voidCount.value = 0
      gameEnded.value = false
      logText.value = ''
      
      // 添加开场日志
      const startNode = story['start']
      addLogEntry(startNode.title, startNode.desc, null)
      changeNode(startNode)
    }

    // 保存结局
    const saveEnding = (ending) => {
      const saved = localStorage.getItem('story_endings')
      let endings = saved ? JSON.parse(saved) : []
      if (!endings.includes(ending)) {
        endings.push(ending)
        localStorage.setItem('story_endings', JSON.stringify(endings))
        
        if (endings.length >= 5) {
          localStorage.setItem('advanced_story_unlocked', 'true')
          setTimeout(() => {
            alert('✨ 记忆的碎片拼凑完成！\n完整版《遗落之境·深处》已解锁！')
          }, 300)
        }
      }
    }

    // 处理选择
    const makeChoice = (opt) => {
      if (gameEnded.value || isTyping.value) return
      
      // 添加选择到日志
      if (opt.logChoice) {
        addLogEntry(null, null, opt.logChoice)
      }
      
      if (opt.condition === 'will' && stats.value.will < (opt.value || 1)) {
        alert('你觉得爬不上去，只能继续往前走')
        addLogEntry('迷失', '意志不足，无法攀爬，只能继续深入', null)
        changeNode(story['lost'])
        return
      }
      
      if (opt.condition === 'insight' && stats.value.insight < (opt.value || 1)) {
        alert('你盯着看了很久，什么也想不起来')
        gameEnded.value = true
        addLogEntry('结局', '你盯着看了很久，什么也想不起来...', null)
        changeNode(story['ending_half'])
        saveEnding('半醒')
        return
      }
      
      if (opt.action === 'getWatch') {
        inventory.value.push('旧怀表')
      }
      if (opt.action === 'rememberName') {
        inventory.value.push('名字的记忆')
      }
      if (opt.action === 'halfRemember') {
        inventory.value.push('模糊的记忆')
      }
      if (opt.action === 'void') {
        voidCount.value++
      }
      
      const nextNode = story[opt.next]
      if (nextNode) {
        changeNode(nextNode)
        if (nextNode.isEnding) {
          gameEnded.value = true
          addLogEntry('结局', nextNode.desc, null)
          saveEnding(nextNode.ending)
        }
      }
    }

    // 重置游戏
    const resetGame = () => {
      initGame()
    }

    // 返回确认
    const showBackConfirm = () => {
      showBackDialog.value = true
    }
    
    const confirmBack = () => {
      showBackDialog.value = false
      router.push('/who_i_am/secret_quiz/secret_room/run_game')
    }

    // 格式化日志文本，为玩家选择添加颜色
    const formattedLogText = computed(() => {
      if (!logText.value) return ''
      
      // 方法1：使用简单的文本替换，为所有"你的选择："行添加颜色
      const lines = logText.value.split('\n')
      const formattedLines = lines.map(line => {
        if (line.includes('你的选择：')) {
          return `<span class="choice-text">${line}</span>`
        }
        return line
      })
      
      return formattedLines.join('<br>')
    })

    onMounted(() => {
      initGame()
    })

    return {
      currentNode,
      stats,
      inventory,
      displayText,
      isTyping,
      gameEnded,
      showBackDialog,
      showLog,
      logText,
      formattedLogText,
      makeChoice,
      resetGame,
      showBackConfirm,
      confirmBack
    }
  }
}
</script>

<style scoped>
.run-game {
  min-height: 100vh;
  background: linear-gradient(145deg, var(--app-page-gradient-start) 0%, var(--app-page-gradient-end) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  transition: background var(--app-transition);
}

.game-container {
  max-width: 700px;
  width: 100%;
  background: var(--app-container-bg);
  backdrop-filter: blur(12px);
  border: 2px solid #ff69b4;
  border-radius: 32px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
  position: relative;
  transition: background var(--app-transition);
}

.story-title {
  font-size: 1.8rem;
  color: #ff69b4;
  margin-bottom: 1rem;
  text-align: center;
}

.story-text-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  min-height: 120px;
}

.story-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--app-text);
  white-space: pre-line;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #ff69b4;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

.typing-placeholder {
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.dot {
  font-size: 1.5rem;
  color: var(--app-accent-text);
  animation: pulse 1.5s infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  padding: 0.8rem 1.5rem;
  background: var(--app-btn-secondary-bg);
  border: 1px solid var(--app-divider);
  border-radius: 40px;
  color: var(--app-text);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.option-btn:hover:not(:disabled) {
  background: var(--app-btn-secondary-hover);
  border-color: #ff69b4;
  transform: translateX(5px);
}

.end-message {
  text-align: center;
  padding: 1rem;
  margin-bottom: 2rem;
}

.end-message p {
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.stats, .items {
  display: flex;
  gap: 1rem;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--app-accent-text);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--app-divider);
}

/* 冒险日志面板 - 固定在右上角 */
.log-panel {
  position: fixed;
  right: 20px;
  top: 20px;
  width: 300px;
  background: var(--app-bg-card-translucent);
  backdrop-filter: blur(12px);
  border: 1px solid #ff69b4;
  border-radius: 16px;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.4);
  animation: panelFadeIn 0.5s ease-out;
}

@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.log-panel.log-expanded {
  width: 350px;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  color: #ff69b4;
  font-weight: bold;
  border-bottom: 1px solid var(--app-divider);
}

.log-icon {
  font-size: 1.2rem;
}

.log-toggle {
  margin-left: auto;
}

.log-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0.5rem;
}

.log-text {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--app-fun-text);
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 0.5rem;
}

/* 玩家选择特殊着色 */
.log-content .log-text .choice-text {
  color: #00e6ff !important; /* 明亮的天蓝色/青色 */
  font-weight: bold !important;
  text-shadow: 0 0 5px rgba(0, 230, 255, 0.5) !important;
}

/* 滚动条样式 */
.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: var(--app-btn-secondary-bg);
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-thumb {
  background: #ff69b4;
  border-radius: 3px;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.back-btn, .reset-btn {
  flex: 1;
  padding: 0.8rem;
  border-radius: 40px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.back-btn {
  background: var(--app-btn-secondary-bg);
  border: 1px solid var(--app-divider);
  color: var(--app-accent-text);
}

.back-btn:hover {
  background: var(--app-btn-secondary-hover);
  border-color: #ff9b8c;
}

.reset-btn {
  background: #2a1f36;
  border: 1px solid #5c3a48;
  color: #ff9b8c;
}

.reset-btn:hover {
  background: #3a2f46;
  transform: scale(1.02);
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  background: linear-gradient(145deg, var(--app-btn-secondary-bg), var(--app-bg));
  border: 2px solid #ff69b4;
  border-radius: 24px;
  padding: 2rem;
  max-width: 350px;
  width: 90%;
  text-align: center;
  animation: dialogPop 0.3s ease;
}

@keyframes dialogPop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.dialog-content h3 {
  color: #ff69b4;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.dialog-content p {
  color: var(--app-text);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.dialog-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.dialog-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.dialog-btn.cancel {
  background: var(--app-btn-secondary-bg);
  color: var(--app-accent-text);
  border: 1px solid var(--app-divider);
}

.dialog-btn.confirm {
  background: #ff69b4;
  color: white;
}

.dialog-btn:hover {
  transform: scale(1.05);
}

/* 手机端适配 - 保持右上角位置 */
@media (max-width: 900px) {
  .log-panel {
    position: fixed;
    right: 10px;
    top: 10px;
    left: auto;
    bottom: auto;
    width: 90%;
    max-width: 320px;
    max-height: 50vh;
    border-radius: 16px;
  }
  
  .log-panel.log-expanded {
    width: 90%;
    max-width: 380px;
    max-height: 60vh;
  }
  
  .log-content {
    max-height: calc(100% - 50px);
  }
  
  .game-container {
    margin-top: 60px;
    margin-bottom: 20px;
  }
}
</style>