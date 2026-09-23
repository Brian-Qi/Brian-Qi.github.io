<template>
  <div>
    <section class="co-hero">
      <span class="co-kicker">联系我们</span>
      <h1>合作 / 咨询</h1>
      <p class="co-sub">游戏开发、数字内容、数据与 AI 方向的合作，或单纯想聊聊，都欢迎。</p>
    </section>

    <section class="co-section">
      <h2 class="co-h2">联系方式</h2>
      <div class="co-grid">
        <a class="co-card" :href="'mailto:' + co.email">
          <span class="co-label">邮箱</span>
          <h3>{{ co.email }}</h3>
          <p>首选联系方式，一般 1–2 个工作日内回复。</p>
        </a>
        <a class="co-card" :href="co.github" target="_blank" rel="noopener">
          <span class="co-label">GitHub</span>
          <h3>@{{ co.github.split('/').pop() }}</h3>
          <p>看代码与开源项目。</p>
        </a>
        <div class="co-card">
          <span class="co-label">电话</span>
          <h3 v-if="co.phone">{{ co.phone }}</h3>
          <h3 v-else class="co-todo">&nbsp;</h3>
          <p>工作日 10:00 – 18:00。</p>
        </div>
        <div class="co-card">
          <span class="co-label">微信</span>
          <h3 v-if="co.wechat">{{ co.wechat }}</h3>
          <h3 v-else class="co-todo">&nbsp;</h3>
          <p>添加时请简单说明来意。</p>
        </div>
      </div>
    </section>

    <section class="co-section">
      <h2 class="co-h2">地址与登记</h2>
      <table class="co-table">
        <tbody>
          <tr><th>地址</th><td>{{ co.address }}</td></tr>
          <tr><th>主体名称</th><td>{{ co.name }}</td></tr>
          <tr><th>经营者</th><td>{{ co.operator }}</td></tr>
          <tr><th>统一社会信用代码</th><td class="co-mono">{{ co.creditCode }}</td></tr>
          <tr><th>登记状态</th><td class="co-status">{{ co.status }}</td></tr>
        </tbody>
      </table>
      <p class="co-lead" style="margin-top: 1rem">
        以上登记信息以市场监督管理部门公示为准；如需加盖公章的合作文件，请通过邮箱联系。
      </p>
    </section>

    <section class="co-section">
      <div class="co-cta" style="justify-content: flex-start">
        <a class="co-btn primary" :href="'mailto:' + co.email">发邮件</a>
        <RouterLink class="co-btn" to="/index/works">先看作品</RouterLink>
      </div>
    </section>
  </div>
</template>

<script>
import company from '@/data/company'

export default {
  name: 'CompanyContact',
  data() {
    return { co: company }
  }
}
</script>

<style scoped>
.co-card {
  text-decoration: none;
  display: block;
}
.co-card h3 {
  word-break: break-all;
}
</style>
