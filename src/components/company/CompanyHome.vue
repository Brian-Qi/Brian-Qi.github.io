<template>
  <div>
    <!-- Hero -->
    <section class="co-hero">
      <span class="co-kicker">{{ co.type }} · {{ co.status }}</span>
      <h1>{{ co.name }}</h1>
      <p class="co-sub">
        {{ co.tagline }}。<br />
        一家位于杭州的独立工作室，做游戏，也做把想法变成可玩、可看之物的那些数字活儿。
      </p>
      <div class="co-cta">
        <RouterLink class="co-btn primary" to="/index/works">看看作品</RouterLink>
        <RouterLink class="co-btn" to="/index/services">业务范围</RouterLink>
        <a class="co-btn" :href="co.github" target="_blank" rel="noopener">GitHub</a>
      </div>
    </section>

    <!-- 亮点 -->
    <section class="co-section">
      <h2 class="co-h2">我们在做什么</h2>
      <p class="co-lead">四件事，一件一件做扎实。</p>
      <div class="co-grid">
        <div v-for="h in co.highlights" :key="h.k" class="co-card">
          <div class="co-label">{{ h.k }}</div>
          <h3>{{ h.v }}</h3>
          <p>{{ h.d }}</p>
        </div>
      </div>
    </section>

    <!-- 作品 -->
    <section class="co-section">
      <h2 class="co-h2">作品</h2>
      <p class="co-lead">已上线 / 在研的项目。</p>
      <RouterLink v-for="w in co.works" :key="w.id" class="co-card work-teaser" to="/index/works">
        <div class="work-teaser-top">
          <h3>{{ w.name }}</h3>
          <span class="co-tag">{{ w.year }}</span>
        </div>
        <p>{{ w.subtitle }} —— {{ w.desc }}</p>
      </RouterLink>
    </section>

    <!-- 联系 CTA -->
    <section class="co-section">
      <h2 class="co-h2">合作与联系</h2>
      <p class="co-lead">游戏开发、数字内容、民俗与非遗数字化，或者你有个想法想落地——都可以聊聊。</p>
      <div class="co-cta">
        <RouterLink class="co-btn primary" to="/index/contact">查看联系方式</RouterLink>
      </div>
    </section>
  </div>
</template>

<script>
import company from '@/data/company'

export default {
  name: 'CompanyHome',
  data() {
    return { co: company }
  }
}
</script>

<style scoped>
.work-teaser {
  display: block;
  text-decoration: none;
}
.work-teaser-top {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}
.work-teaser h3 {
  margin: 0 0 0.4rem;
  color: var(--app-text);
}
.work-teaser:hover h3 {
  color: var(--app-accent);
}
</style>
