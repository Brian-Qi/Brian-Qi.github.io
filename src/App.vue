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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  
  h1 {
    font-size: 2rem !important;
  }
  
  h2 {
    font-size: 1.5rem !important;
  }
  
  /* 通用容器内边距 */
  .container, .quiz-container, .achievement-card, .fortune-card,
  .bio-card, .project-card, .skills-card, .easter-eggs {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  /* 卡片内边距 */
  .achievement-card, .fortune-card, .quiz-container,
  .bio-card, .project-card, .skills-card, .easter-eggs {
    padding: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  /* 成就图鉴专用 */
  .stats-achievement-card {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 0.8rem !important;
    padding: 1rem !important;
  }
  
  .card-icon {
    font-size: 2.5rem !important;
    min-width: auto !important;
  }
  
  .card-info h3 {
    font-size: 1.2rem !important;
  }
  
  .achievement-code, .achievement-desc {
    font-size: 0.8rem !important;
  }
  
  .unlocked-badge, .locked-badge {
    font-size: 0.8rem !important;
    padding: 0.2rem 0.8rem !important;
  }
  
  /* 运势页面 */
  .fortune-header h1 {
    font-size: 1.5rem !important;
  }
  
  .fortune-level {
    font-size: 2rem !important;
  }
  
  .fortune-text {
    font-size: 1.1rem !important;
  }
  
  .fortune-card {
    padding: 1.5rem 1rem !important;
  }
}

@media (max-width: 480px) {
  body {
    font-size: 12px;
  }
  
  h1 {
    font-size: 1.6rem !important;
  }
  
  h2 {
    font-size: 1.2rem !important;
  }
  
  /* 按钮全宽 */
  button, .return-button, .back-link, .guestbook-button,
  .reset-button, .screenshot-button {
    width: 100% !important;
    justify-content: center !important;
  }
  
  /* 按钮容器 */
  .button-container, .button-group {
    flex-direction: column !important;
    width: 100% !important;
    gap: 0.8rem !important;
  }
  
  /* 留言墙 */
  .message-input-row {
    flex-direction: column !important;
  }
  
  .egg-item {
    gap: 1rem !important;
    flex-wrap: wrap !important;
  }
  
  .egg-item .secret-message {
    margin-left: 0 !important;
  }
  
  /* 技能条 */
  .skill-item {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  
  .skill-bar {
    width: 100% !important;
  }
}
</style>