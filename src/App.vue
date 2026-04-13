<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="achievement" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 导入移动端优化样式 */
@import './styles/mobile-optimization.css';
@import './styles/mobile-utils.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  /* 全局文本换行保护 */
  overflow-wrap: break-word;
  word-wrap: break-word;
}

body {
  background-color: #0a0c0f;
  min-height: 100vh;
  font-size: 16px;
}

#app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #e1e7ef;
  background-color: #0a0c0f;
  min-height: 100vh;
}

.achievement-enter-active {
  animation: shineIn 0.5s ease;
}

.achievement-leave-active {
  animation: shineOut 0.3s ease;
}

@keyframes shineIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
    filter: brightness(2) blur(5px);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1) blur(0);
  }
}

@keyframes shineOut {
  0% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1);
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
    filter: brightness(2) blur(5px);
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
.bio-card, .project-card, .skills-card, .easter-eggs {
  padding-left: clamp(0.5rem, 3vw, 2rem) !important;
  padding-right: clamp(0.5rem, 3vw, 2rem) !important;
  padding-top: clamp(1rem, 4vw, 2rem) !important;
  padding-bottom: clamp(1rem, 4vw, 2rem) !important;
}

/* 卡片响应式圆角 */
.achievement-card, .fortune-card, .quiz-container,
.bio-card, .project-card, .skills-card, .easter-eggs {
  border-radius: clamp(8px, 2vw, 16px) !important;
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