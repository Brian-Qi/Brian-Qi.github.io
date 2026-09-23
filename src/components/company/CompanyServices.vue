<template>
  <div>
    <section class="co-hero">
      <span class="co-kicker">业务范围</span>
      <h1>我们做什么</h1>
      <p class="co-sub">以下为工商登记的经营范围分类，按能力方向归了类。</p>
    </section>

    <section class="co-section">
      <div class="co-grid">
        <div v-for="g in co.scopeGroups" :key="g.key" class="co-card">
          <h3>{{ g.title }}</h3>
          <p>{{ g.desc }}</p>
          <ul class="co-list">
            <li v-for="it in g.items" :key="it">{{ it }}</li>
          </ul>
        </div>
      </div>
      <p class="co-todo" style="margin-top: 1.2rem">经营范围原文：{{ co.scope }}</p>
      <p class="co-lead" style="margin: 0.4rem 0 0">{{ co.scopeNote }}</p>
    </section>

    <section class="co-section">
      <h2 class="co-h2">怎么合作</h2>
      <div class="co-grid">
        <div class="co-card">
          <div class="co-num">01</div>
          <h3>聊需求</h3>
          <p>先弄清目标、边界与验收标准，不急着报价。</p>
        </div>
        <div class="co-card">
          <div class="co-num">02</div>
          <h3>出方案</h3>
          <p>拆成可验证的小步，先给能跑的原型，再谈规模。</p>
        </div>
        <div class="co-card">
          <div class="co-num">03</div>
          <h3>交付</h3>
          <p>完整实现 + 部署上线 + 交付说明文档。</p>
        </div>
      </div>
      <div class="co-cta">
        <RouterLink class="co-btn primary" to="/index/contact">聊聊你的项目</RouterLink>
      </div>
    </section>
  </div>
</template>

<script>
import company from '@/data/company'

export default {
  name: 'CompanyServices',
  data() {
    return { co: company }
  }
}
</script>
