<template>
  <div>
    <section class="co-hero">
      <span class="co-kicker">作品 / 案例</span>
      <h1>做过的东西</h1>
      <p class="co-sub">目前公开的主要作品如下。</p>
    </section>

    <section class="co-section">
      <article v-for="w in co.works" :key="w.id" class="co-work">
        <div>
          <h3>{{ w.name }}</h3>
          <p class="co-work-sub">{{ w.subtitle }}</p>
          <p>{{ w.desc }}</p>
          <div class="co-tags">
            <span v-for="t in w.tags" :key="t" class="co-tag">{{ t }}</span>
          </div>
          <div class="co-cta" style="justify-content: flex-start; margin-top: 1.2rem">
            <a class="co-btn primary" :href="w.url" target="_blank" rel="noopener">前往体验 ↗</a>
          </div>
        </div>

        <aside>
          <div class="co-work-meta">
            <div><span class="co-label">年份</span><br />{{ w.year }}</div>
            <div style="margin-top: 0.9rem"><span class="co-label">角色</span><br />{{ w.role }}</div>
          </div>
          <ul class="co-list">
            <li v-for="h in w.highlights" :key="h">{{ h }}</li>
          </ul>
        </aside>
      </article>
    </section>

    <section class="co-section">
      <h2 class="co-h2">在研 / 更多</h2>
      <p class="co-lead">其它项目还在打磨中，成熟一个公开一个。</p>
      <div class="co-grid">
        <div class="co-card">
          <span class="co-label">在研</span>
          <h3>遗落之境</h3>
          <p>单人跑团 · 文本冒险。意志 / 洞察属性、物品收集与多结局，仍在开发。</p>
          <div class="co-cta" style="justify-content: flex-start; margin-top: 1rem">
            <RouterLink class="co-btn" to="/self/moyu/run_game/the_lost_realm">试玩</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import company from '@/data/company'

export default {
  name: 'CompanyWorks',
  data() {
    return { co: company }
  }
}
</script>
