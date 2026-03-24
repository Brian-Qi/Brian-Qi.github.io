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
          <router-link to="/who_i_am" class="name-link">
            <span class="name-highlight">Briandolph Qi</span>
          </router-link>
          的私人网站
        </h1>
        <div class="status-tag">
          ⏳ 目前仍在开发中 · 悄然生长
        </div>
      </div>

      <div class="fun-section">
        <div class="whimsy-text">
          <span>⚠️</span> 这里没有 404 <span>🚧</span>
        </div>
        <p class="face" @click="goToAchievements">ciallo～(∠・ω< )⌒☆</p>
        <p class="fun-line">
          正在用<span class="glow-dot"></span><span class="glow-dot"></span><span class="glow-dot"></span>和<span class="coffee-badge">☕</span>搭建宇宙
        </p>
        <div class="construction-quote" @click="checkAchievement">
          <span>🧙‍♂️</span> 施工精灵说：“再写{{ tmp_line }}行代码就能跑起来...大概”
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
        <div><span class="emoji-big">🤖</span> 与AI斗嘴中</div>
        <div><span class="emoji-big">🧪</span> 锟斤拷烫烫烫</div>
      </div>

      <div class="easter-egg">
        没有找到index.html？别慌，也许它在 <span class="mono">✨平行宇宙✨</span> 里
        <div class="version-tag">vue static · dark mode · 开发秘境 · v0.0.1-alpha.0</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
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
        router.push('/achieve_slacking')
      } else {
        const messages = [
          `🧙‍♂️\n怎么了怎么了 ⊙ω⊙`,
          `🧙‍♂️\n才没有在摸鱼呢 (￣ω￣;)`,
          `🧙‍♂️\n那个...再写点代码吧...\n(⁄ ⁄•⁄ω⁄•⁄ ⁄)`,
          `🧙‍♂️\n施工中，勿扰！ (・_・)`,
          `🧙‍♂️\n被发现了...其实还差一点 (◡‿◡✿)`
        ]
        dialogMessage.value = messages[Math.floor(Math.random() * messages.length)]
        showDialog.value = true
      }
    }
    
    const goToAchievements = () => {
      router.push('/achievements')
    }
    
    return {
      tmp_line,
      progress,
      showDialog,
      dialogMessage,
      checkAchievement,
      goToAchievements
    }
  }
}
</script>

<style scoped lang="scss">

.coming-soon {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0c0f;
  background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #e1e7ef;
  line-height: 1.5;
  padding: 1rem;
}

.container {
  max-width: 720px;
  width: 100%;
  margin: 2rem auto;
  padding: 3rem 2.5rem;
  background: rgba(18, 22, 28, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(66, 80, 96, 0.3);
  border-radius: 48px;
  box-shadow: 0 30px 50px -20px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.03);
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.005);
    border-color: rgba(100, 120, 140, 0.4);
  }
}

/* ========== 移动端适配（统一合并版） ========== */

/* 平板/大手机 (600px 及以下) */
@media screen and (max-width: 600px) {
  .container {
    padding: 2rem 1.5rem;
    border-radius: 32px;
    margin: 1rem auto;
  }

  .main-message h1 {
    font-size: 2rem;
    line-height: 1.3;
  }

  .status-tag {
    font-size: 0.8rem;
    padding: 0.2rem 0.8rem;
  }

  .fun-section {
    padding: 1.5rem 1rem;
    margin: 1.5rem 0;
  }

  .whimsy-text {
    font-size: 1.1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .face {
    font-size: 1.4rem;
  }

  .fun-line {
    font-size: 1rem;
  }

  .construction-quote {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .construction-zone {
    gap: 0.8rem;
  }

  .construction-zone div {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .emoji-big {
    font-size: 1.1rem;
  }

  .eta-message {
    font-size: 0.8rem;
  }

  .easter-egg {
    font-size: 0.7rem;
    margin-top: 1.5rem;
  }

  .easter-egg code {
    font-size: 0.65rem;
  }

  .progress-area {
    margin: 1.5rem 0 0.8rem;
  }
}

/* 超小手机 (375px 及以下) */
@media screen and (max-width: 375px) {
  .container {
    padding: 1.5rem 1rem;
  }

  .main-message h1 {
    font-size: 1.6rem;
  }

  .construction-zone {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .construction-zone div {
    width: fit-content;
  }

  .fun-section {
    padding: 1.2rem 0.8rem;
  }

  .whimsy-text {
    font-size: 1rem;
  }
}

/* 主标题区域 */
.main-message {
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.8rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #ffffff, #c0ccd9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    line-height: 1.2;

    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }
}

.name-link {
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(157, 139, 255, 0.6));
  }
}

.name-highlight {
  font-weight: 600;
  background: linear-gradient(135deg, #b3a0ff, #8f9eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 2px dotted rgba(157, 139, 255, 0.3);
  padding-bottom: 2px;
}

.status-tag {
  display: inline-block;
  background: #1f2a36;
  color: #bdd3f0;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.3rem 1rem;
  border-radius: 40px;
  border: 1px solid #31465c;
  backdrop-filter: blur(4px);
  margin-top: 0.8rem;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.fun-section {
  background: rgba(8, 12, 17, 0.6);
  border-radius: 32px;
  padding: 2rem 1.8rem;
  margin: 2.2rem 0 1.8rem;
  border: 1px solid #26323f;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 10px 20px -10px #000000;
}

.whimsy-text {
  font-size: 1.3rem;
  font-weight: 400;
  color: #ccdeff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;

  span {
    background: #1e293b;
    padding: 0.2rem 0.8rem;
    border-radius: 60px;
    font-size: 1rem;
    border: 1px solid #3e5268;
  }
}

.face {
  font-size: 1.7rem;
  margin: 0.2rem 0 0.2rem;
  color: #18dddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.face:hover {
  transform: scale(1.1);
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.fun-line {
  font-size: 1.2rem;
  font-weight: 300;
  max-width: 450px;
  margin: 1rem auto 0;
  color: #b7cced;
}

.coffee-badge {
  font-family: monospace;
  background: #1f293d;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 4px;
}

.construction-quote {
  margin-top: 1.5rem;
  background: #0f1a22;
  border-radius: 40px;
  padding: 0.7rem 1.2rem;
  border: 1px dashed #435973;
  color: #b7cfed;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.construction-quote:hover {
  transform: scale(1.02);
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

.progress-area {
  margin: 2rem 0 1rem;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #1b232e;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #2c3a48;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(74, 110, 255, 0.9),
    rgba(46, 204, 113, 0.9),
    rgba(138, 109, 233, 0.9),
    rgba(74, 110, 255, 0.9)
  );
  background-size: 300% 100%;
  border-radius: 20px;
  animation: auroraGlow 25s infinite linear;
  box-shadow: 0 0 15px rgba(74, 110, 255, 0.5);
  transition: width 0.5s ease;
}

@keyframes auroraGlow {
  0% { background-position: 0% 0; }
  100% { background-position: 300% 0; }
}

.eta-message {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #90a4c2;
  margin-top: 0.6rem;
  font-weight: 400;

  i {
    font-style: normal;
    background: #1d2a36;
    padding: 0.15rem 0.6rem;
    border-radius: 20px;
  }
}

.construction-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 2.2rem 0 0.8rem;
  font-size: 0.95rem;
  color: #7f95b5;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #131e28;
    padding: 0.5rem 1.2rem;
    border-radius: 60px;
    border: 1px solid #334252;
  }
}

.emoji-big {
  font-size: 1.3rem;
  filter: drop-shadow(0 0 4px #5075a8);
}

.easter-egg {
  margin-top: 2.5rem;
  opacity: 0.55;
  font-size: 0.8rem;
  color: #506277;
  transition: opacity 0.2s;
  cursor: default;
  border-top: 1px dashed #2a3744;
  padding-top: 1.5rem;

  &:hover {
    opacity: 1;
    color: #7f9bc0;
  }

  code {
    background: #151f2b;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-family: 'Fira Code', monospace;
    border: 1px solid #32485b;
  }
}

.mono {
  font-family: monospace;
}

.version-tag {
  margin-top: 0.8rem;
  font-size: 0.75rem;
  color: #3c536b;
}

.glow-dot {
  width: 6px;
  height: 6px;
  background: #9bbaff;
  border-radius: 50%;
  display: inline-block;
  margin: 0 4px;
  animation: pulse 1.8s infinite;
  opacity: 0.6;

  @keyframes pulse {
    0% { opacity: 0.3; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.3); background-color: #d9e6ff; }
  }
}

.custom-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.dialog-content {
  background: linear-gradient(145deg, #1f2a36, #0f1a22);
  border: 2px solid #ffd700;
  border-radius: 40px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
  animation: dialogPop 0.4s ease;
}

@keyframes dialogPop {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.dialog-message {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  white-space: pre-line;
  font-weight: bold;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.dialog-button {
  background: #42b983;
  color: #0a0c0f;
  border: none;
  border-radius: 60px;
  padding: 1rem 3rem;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.3);
}

.dialog-button:hover {
  transform: scale(1.1);
  background: #5dca9c;
  box-shadow: 0 0 30px rgba(66, 185, 131, 0.6);
}

@media (max-width: 600px) {
  .dialog-content {
    padding: 2rem;
  }
  .dialog-message {
    font-size: 1.6rem;
  }
  .dialog-button {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
  }
}
</style>