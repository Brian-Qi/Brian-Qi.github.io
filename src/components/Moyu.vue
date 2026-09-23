<template>
  <div class="moyu">
    <div class="moyu-inner">
      <header class="moyu-head">
        <h1>🐟 摸鱼区</h1>
        <p>累了就进来待会儿，随便逛逛。</p>
      </header>

      <div class="moyu-list">
        <RouterLink to="/self/guestbook" class="moyu-card">
          <span class="moyu-icon">📝</span>
          <span class="moyu-info">
            <h3>留言墙</h3>
            <p>留几句话，也看看别人留下了什么。</p>
          </span>
          <span class="moyu-arrow">→</span>
        </RouterLink>

        <RouterLink to="/self/moyu/run_game" class="moyu-card">
          <span class="moyu-icon">🎲</span>
          <span class="moyu-info">
            <h3>单人跑团</h3>
            <p>一个人的桌上冒险，随手来一把。</p>
          </span>
          <span class="moyu-arrow">→</span>
        </RouterLink>

        <a href="/arg_01/" class="moyu-card">
          <span class="moyu-icon">📜</span>
          <span class="moyu-info">
            <h3>第五张财签 <em>ARG</em></h3>
            <p>民国旧案的民俗解谜 · 约 30 分钟。</p>
          </span>
          <span class="moyu-arrow">→</span>
        </a>
      </div>

      <div class="moyu-more">
        <span>🚧</span>
        <span>更多还在这条船上 · 敬请期待</span>
      </div>

      <RouterLink to="/" class="moyu-back">← 返回首页</RouterLink>
    </div>
  </div>
</template>

<script>
export default { name: 'MoyuPage' }
</script>

<style scoped>
.moyu {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem 1.4rem;
  background: linear-gradient(160deg, var(--app-page-gradient-start), var(--app-page-gradient-end));
  color: var(--app-text);
  transition:
    background var(--app-transition),
    color var(--app-transition);
}
.moyu-inner {
  width: 100%;
  max-width: 520px;
}

.moyu-head {
  text-align: center;
  margin-bottom: 1.8rem;
}
.moyu-head h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, var(--app-accent), #4dc9f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.moyu-head p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--app-text-secondary);
}

.moyu-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.moyu-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem 1.3rem;
  border-radius: 20px;
  text-decoration: none;
  color: var(--app-text);
  background: var(--app-bg-card);
  border: 1px solid var(--app-border);
  box-shadow: var(--app-shadow);
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
}
.moyu-card:hover {
  transform: translateY(-2px);
  border-color: var(--app-accent);
  box-shadow: 0 10px 26px -12px var(--app-accent-glow);
}
.moyu-icon {
  font-size: 1.9rem;
  min-width: 42px;
  text-align: center;
}
.moyu-info {
  flex: 1;
  min-width: 0;
}
.moyu-info h3 {
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
}
.moyu-info h3 em {
  font-style: normal;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: var(--app-accent);
  border: 1px solid var(--app-accent);
  border-radius: 6px;
  padding: 0 5px;
  margin-left: 4px;
  vertical-align: middle;
}
.moyu-info p {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--app-text-secondary);
}
.moyu-arrow {
  color: var(--app-text-muted);
  transition:
    transform 0.24s ease,
    color 0.24s ease;
}
.moyu-card:hover .moyu-arrow {
  color: var(--app-accent);
  transform: translateX(3px);
}

.moyu-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.9rem;
  padding: 0.7rem 1rem;
  font-size: 0.8rem;
  color: var(--app-text-muted);
  border: 1px dashed var(--app-border);
  border-radius: 16px;
}

.moyu-back {
  display: block;
  width: fit-content;
  margin: 1.8rem auto 0;
  padding: 0.5rem 1.1rem;
  font-size: 0.85rem;
  color: var(--app-text-secondary);
  text-decoration: none;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  transition: all 0.24s ease;
}
.moyu-back:hover {
  color: var(--app-accent);
  border-color: var(--app-accent);
}

@media (max-width: 480px) {
  .moyu-icon {
    font-size: 1.6rem;
    min-width: 34px;
  }
  .moyu-card {
    padding: 0.9rem 1rem;
    gap: 0.8rem;
  }
}
</style>
