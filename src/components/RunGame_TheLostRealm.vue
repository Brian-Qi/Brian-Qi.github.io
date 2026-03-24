<template>
  <div class="run-game">
    <div class="game-container">
      <!-- 游戏内容 -->
      <div class="game-content">
        <h2 class="story-title">{{ currentNode.title }}</h2>
        <div class="story-text">{{ currentNode.desc }}</div>
        
        <!-- 选项按钮 -->
        <div class="options">
          <button 
            v-for="(opt, idx) in currentNode.options" 
            :key="idx"
            class="option-btn"
            @click="makeChoice(opt)"
          >
            {{ opt.text }}
          </button>
        </div>

        <!-- 属性显示 -->
        <div class="stats" v-if="stats">
          <span>🧠 意志: {{ stats.will }}</span>
          <span>👁️ 洞察: {{ stats.insight }}</span>
        </div>

        <!-- 物品显示 -->
        <div class="items" v-if="inventory.length">
          📦 物品: {{ inventory.join(', ') }}
        </div>
      </div>

      <!-- 重玩按钮 -->
      <button class="reset-btn" @click="resetGame">🔄 重开</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RunGameTheLostRealm',
  setup() {
    const router = useRouter()
    const currentNode = ref({})
    const stats = ref(null)
    const inventory = ref([])
    const gameEnded = ref(false)
    const voidCount = ref(0)  // 虚无结局计数器

    // 游戏数据
    const story = {
      // 节点1：起点
      'start': {
        id: 'start',
        title: '灰色海滩',
        desc: '你在灰色的海滩上醒来，海水是铅灰色的，天空也是。你记得自己是谁，但想不起来为什么会在这里。面前只有两条路：左边的沙滩，右边的枯树林。',
        options: [
          { text: '🏖️ 沿沙滩走', next: 'beach' },
          { text: '🌲 进入枯林', next: 'forest' }
        ]
      },
      
      // 节点2：海滩
      'beach': {
        id: 'beach',
        title: '搁浅之物',
        desc: '沙滩上有什么东西被冲了上来。走近看，是一枚旧怀表，表盘已经不动了。背面刻着一行模糊的字："给______，别忘了我。"',
        options: [
          { text: '📿 捡起怀表', next: 'crossroad', action: 'getWatch' },
          { text: '🚶 继续走', next: 'crossroad' }
        ]
      },
      
      // 节点3：森林
      'forest': {
        id: 'forest',
        title: '无声森林',
        desc: '树木是灰色的，没有叶子，只有枝干。越往里走，声音越少。深处似乎有座木屋。',
        options: [
          { text: '🏠 去树屋看看', next: 'treehouse', condition: 'will', value: 1 },
          { text: '🌳 继续深入', next: 'lost' },
          { text: '😞 放弃，回头', next: 'void_path' }
        ]
      },
      
      // 节点4：树屋
      'treehouse': {
        id: 'treehouse',
        title: '树屋',
        desc: '树屋里有一面镜子。镜子里映出的不是你，而是另一个人。他看着你，不说话，但你知道他在问：要留下吗？',
        options: [
          { text: '💔 留下', next: 'ending_stay' },
          { text: '🚪 离开', next: 'crossroad' }
        ]
      },
      
      // 节点5：岔路口
      'crossroad': {
        id: 'crossroad',
        title: '岔路口',
        desc: '路在这里分成两条。一条通往海边，一条通往森林深处。',
        options: [
          { text: '🌊 回海边看看', next: 'tide' },
          { text: '🌲 进森林', next: 'forest' }
        ]
      },
      
      // 节点6：潮汐线
      'tide': {
        id: 'tide',
        title: '潮汐线',
        desc: '海水退去，沙滩上露出一行字："你的名字是______"。你盯着那行字，感觉有什么东西从记忆深处浮上来。',
        options: [
          { text: '💭 想起名字', next: 'ending_return', condition: 'insight', value: 1, action: 'rememberName' },
          { text: '😵 想不起来', next: 'ending_half', action: 'halfRemember' }
        ]
      },
      
      // 节点7：迷失
      'lost': {
        id: 'lost',
        title: '迷失',
        desc: '你在森林里走了太久，开始忘记自己是谁。树根悄悄缠上你的脚踝。',
        options: [
          { text: '🏃 挣扎', next: 'ending_erosion', action: 'struggle' }
        ]
      },
      
      // 虚无路径
      'void_path': {
        id: 'void_path',
        title: '放弃',
        desc: '你选择了放弃。没有继续前进，也没有回头。只是站在原地。\n\n时间慢慢流逝，你的轮廓开始模糊。',
        options: [
          { text: '......', next: 'void_confirm' }
        ]
      },
      
      'void_confirm': {
        id: 'void_confirm',
        title: '消逝',
        desc: '你真的要放弃一切吗？记忆、名字、还有回去的路？',
        options: [
          { text: '😞 放弃', next: 'ending_void', action: 'void' },
          { text: '💪 不，我要回去', next: 'start' }
        ]
      },
      
      // 结局A：回归
      'ending_return': {
        id: 'ending_return',
        title: '✨ 回归 ✨',
        desc: '你想起了自己的名字。海面上突然出现一道光，那是来时的路。你握紧怀表，走了出去。\n\n工位上的屏幕还亮着，时间只过了三分钟。没有人知道你去了哪里。\n\n【结局：回归】',
        options: [],
        isEnding: true,
        ending: '回归'
      },
      
      // 结局B：半醒
      'ending_half': {
        id: 'ending_half',
        title: '🌫️ 半醒 🌫️',
        desc: '你走出了这片空间，但总觉得心里少了一块。\n\n怀表还在，名字还记得，但有些东西永远留在了那片灰色海滩。\n\n【结局：半醒】',
        options: [],
        isEnding: true,
        ending: '半醒'
      },
      
      // 结局C：滞留
      'ending_stay': {
        id: 'ending_stay',
        title: '🏠 滞留 🏠',
        desc: '你留在了树屋里。镜中的人笑了，他说他等了好久，终于有人愿意留下。\n\n窗外是永远灰色的海，但你们可以一起看。\n\n【结局：滞留】',
        options: [],
        isEnding: true,
        ending: '滞留'
      },
      
      // 结局D：侵蚀
      'ending_erosion': {
        id: 'ending_erosion',
        title: '🌳 侵蚀 🌳',
        desc: '你没有挣脱。树根慢慢缠住你的身体，你的皮肤变成树皮，手臂变成枝干。\n\n你成为森林里的又一棵树，风吹过的时候会沙沙响。\n\n【结局：侵蚀】',
        options: [],
        isEnding: true,
        ending: '侵蚀'
      },
      
      // 结局E：虚无
      'ending_void': {
        id: 'ending_void',
        title: '💀 虚无 💀',
        desc: '你拒绝了所有的记忆和真相。最终，出口不是回归，而是彻底的虚无。\n\n你的存在被从所有时空中抹除，仿佛从未存在过。\n\n【结局：虚无】',
        options: [],
        isEnding: true,
        ending: '虚无'
      }
    }

    // 初始化游戏
    const initGame = () => {
      // 随机生成属性
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
      currentNode.value = story['start']
    }

    // 处理选择
    const makeChoice = (opt) => {
      if (gameEnded.value) return
      
      // 检查条件
      if (opt.condition === 'will' && stats.value.will < (opt.value || 1)) {
        alert('你觉得爬不上去，只能继续往前走')
        currentNode.value = story['lost']
        return
      }
      
      if (opt.condition === 'insight' && stats.value.insight < (opt.value || 1)) {
        alert('你盯着看了很久，什么也想不起来')
        currentNode.value = story['ending_half']
        gameEnded.value = true
        saveEnding('半醒')
        return
      }
      
      // 执行动作
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
      
      // 跳转
      const nextNode = story[opt.next]
      if (nextNode) {
        currentNode.value = nextNode
        
        // 如果是结局，记录并返回
        if (nextNode.isEnding) {
          gameEnded.value = true
          saveEnding(nextNode.ending)
        }
      }
    }

    // 保存结局
    const saveEnding = (ending) => {
      const saved = localStorage.getItem('story_endings')
      let endings = saved ? JSON.parse(saved) : []
      if (!endings.includes(ending)) {
        endings.push(ending)
        localStorage.setItem('story_endings', JSON.stringify(endings))
        
        // 检查是否解锁完整版（5个结局）
        if (endings.length >= 5) {
          localStorage.setItem('advanced_story_unlocked', 'true')
          setTimeout(() => {
            alert('✨ 记忆的碎片拼凑完成！\n完整版《遗落之境·深处》已解锁！')
          }, 300)
        }
      }
    }

    // 重置游戏
    const resetGame = () => {
      initGame()
    }

    onMounted(() => {
      initGame()
    })

    return {
      currentNode,
      stats,
      inventory,
      makeChoice,
      resetGame
    }
  }
}
</script>

<style scoped>
.run-game {
  min-height: 100vh;
  background: linear-gradient(145deg, #1a1f2a 0%, #2a1f2a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.game-container {
  max-width: 600px;
  width: 100%;
  background: rgba(20, 25, 35, 0.9);
  backdrop-filter: blur(12px);
  border: 2px solid #ff69b4;
  border-radius: 32px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
}

.story-title {
  font-size: 1.8rem;
  color: #ff69b4;
  margin-bottom: 1rem;
  text-align: center;
}

.story-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e1e7ef;
  margin-bottom: 2rem;
  white-space: pre-line;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  padding: 0.8rem 1.5rem;
  background: #1f2a36;
  border: 1px solid #31465c;
  border-radius: 40px;
  color: #e1e7ef;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.option-btn:hover {
  background: #2a3848;
  border-color: #ff69b4;
  transform: translateX(5px);
}

.stats, .items {
  display: flex;
  gap: 1rem;
  justify-content: center;
  font-size: 0.9rem;
  color: #8f9eff;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #31465c;
}

.reset-btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  background: #2a1f36;
  border: 1px solid #5c3a48;
  border-radius: 40px;
  color: #ff9b8c;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.reset-btn:hover {
  background: #3a2f46;
  transform: scale(1.02);
}

@media (max-width: 600px) {
  .game-container {
    padding: 1.5rem;
  }
  .story-title {
    font-size: 1.5rem;
  }
  .story-text {
    font-size: 1rem;
  }
}
</style>