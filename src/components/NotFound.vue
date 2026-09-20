<template>
  <div class="nf-wrap">
    <div class="nf-card">
      <p class="nf-code">404</p>
      <h1 class="nf-title">这页好像走丢了</h1>
      <p class="nf-desc">你要找的地址不存在，或者已经被挪走了。</p>
      <div class="nf-actions">
        <RouterLink class="nf-btn primary" to="/index">回到首页</RouterLink>
        <RouterLink class="nf-btn" to="/">回到入口</RouterLink>
        <RouterLink class="nf-btn" to="/who_i_am">关于我</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.nf-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}
.nf-card {
  width: min(520px, 100%);
  text-align: center;
  padding: 40px 28px;
  background: var(--app-bg-card, #fff);
  border: 1px solid var(--app-border, #c8d2e0);
  border-radius: var(--app-radius, 16px);
  box-shadow: var(--app-shadow-lg, 0 12px 40px rgba(0, 0, 0, 0.08));
  transition:
    background var(--app-transition, 0.3s),
    border-color var(--app-transition, 0.3s);
}
.nf-code {
  margin: 0;
  font-family: 'DigifaceWide', 'LXGW WenKai', sans-serif;
  font-size: 64px;
  line-height: 1;
  letter-spacing: 4px;
  color: var(--app-accent, #7c5cfc);
  opacity: 0.85;
}
.nf-title {
  margin: 10px 0 6px;
  font-size: 22px;
  color: var(--app-text, #2c3e50);
}
.nf-desc {
  margin: 0 0 22px;
  font-size: 14px;
  color: var(--app-text-secondary, #6b7d95);
}
.nf-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.nf-btn {
  display: inline-block;
  padding: 9px 18px;
  font-size: 14px;
  text-decoration: none;
  color: var(--app-accent, #7c5cfc);
  border: 1px solid var(--app-accent, #7c5cfc);
  border-radius: 999px;
  transition:
    background var(--app-transition, 0.3s),
    color var(--app-transition, 0.3s);
}
.nf-btn.primary {
  background: var(--app-accent, #7c5cfc);
  color: #fff;
}
.nf-btn:hover {
  background: var(--app-accent-light, #a78bfa);
  border-color: var(--app-accent-light, #a78bfa);
  color: #fff;
}
</style>
