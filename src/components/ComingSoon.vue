<template>
  <div class="coming-soon">
    <div class="container">
      <!-- 主信息：私人网站 + 名字 -->
      <div class="main-message">
        <h1>
          <span class="name-highlight">Briandolph Qi</span> 的私人网站
        </h1>
        <div class="status-tag">
          ⏳ 目前仍在开发中 · 悄然生长
        </div>
      </div>

      <!-- 趣味文字区域 -->
      <div class="fun-section">
        <div class="whimsy-text">
          <span>⚠️</span> 这里没有 404 <span>🚧</span>
        </div>
        <p class="face">ciallo～(∠・ω< )⌒☆</p>
        <p class="fun-line">
          正在用<span class="glow-dot"></span><span class="glow-dot"></span><span class="glow-dot"></span>和<span class="coffee-badge">☕</span>搭建宇宙
        </p>
        <div class="construction-quote">
          <span>🧙‍♂️</span> 施工精灵说：“再写{{tmp_line}}行代码就能跑起来...大概”
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-area">
        <div class="progress-bar-bg">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="eta-message">
          <span><i>📦</i> 页面装修进度 {{ progress }}%</span>
          <span><i>⏱️</i> 还差 ??? 个深夜</span>
        </div>
      </div>

      <!-- 施工状态标签 -->
      <div class="construction-zone">
        <div><span class="emoji-big">🛸</span> 正在调试虫洞</div>
        <div><span class="emoji-big">🤖</span> 与AI斗嘴中</div>
        <div><span class="emoji-big">🧪</span> 锟斤拷烫烫</div>
      </div>

      <!-- 小彩蛋 -->
      <div class="easter-egg">
        <code> ~/briandolph.xyz $ </code> 没有找到index.html？别慌，也许它在 <span class="mono">✨平行宇宙✨</span> 里
        <div class="version-tag">vue static · dark mode · 开发秘境 · v0.0.1-alpha.0</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'ComingSoon',
  setup() {
    const randomProgress = Math.floor(Math.random() * 41) + 30
    const progress = ref(randomProgress)
    const randomtmpline=Math.floor(Math.random() * 80) + 20
    const tmp_line=ref(randomtmpline)
    return {
      tmp_line,
      progress
    }
  }
}
</script>

<style scoped lang="scss">
/* 暗色调基础样式 */
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

/* 主卡片 */
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

    @media (max-width: 500px) {
      font-size: 2rem;
    }
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

/* 趣味区域 */
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
  color: #eaeef7;
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
}

/* 进度条 */
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

// .progress-fill {
//   height: 100%;
//   background: linear-gradient(90deg, #6d8cff, #b08cff, #ff9b8c);
//   background-size: 200% 100%;
//   border-radius: 20px;
//   animation: shimmer 3s infinite linear, glowPulse 2s infinite alternate;
//   transition: width 0.5s ease;
// }

// @keyframes shimmer {
//   0% { background-position: 0% 0; }
//   100% { background-position: 200% 0; }
// }

// @keyframes glowPulse {
//   0% { box-shadow: 0 0 5px #6d8cff; }
//   100% { box-shadow: 0 0 18px #b08cff; }
// }

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(74, 110, 255, 0.9),   /* 半透明极光蓝 */
    rgba(46, 204, 113, 0.9),   /* 半透明极光绿 */
    rgba(138, 109, 233, 0.9),  /* 半透明极光紫 */
    rgba(74, 110, 255, 0.9)    /* 回到极光蓝 */
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

/* 施工状态标签 */
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

/* 小彩蛋 */
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

/* 闪烁小圆点 */
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

/* 响应式 */
@media (max-width: 500px) {
  .container {
    padding: 2rem 1.5rem;
    border-radius: 32px;
  }
  
  .whimsy-text {
    font-size: 1.1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>