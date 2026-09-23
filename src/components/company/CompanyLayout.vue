<template>
  <div class="co-shell">
    <div class="co-wrap">
      <router-view />
    </div>

    <footer class="co-foot">
      <div class="co-foot-inner">
        <div>
          <strong>{{ co.name }}</strong><br />
          {{ co.type }} · {{ co.tagline }}<br />
          统一社会信用代码 <span class="co-mono">{{ co.creditCode }}</span>
        </div>
        <div>
          <RouterLink to="/">入口</RouterLink> · <RouterLink to="/self">个人站</RouterLink> ·
          <a :href="co.github" target="_blank" rel="noopener">GitHub</a> ·
          <a :href="'mailto:' + co.email">邮箱</a><br />
          Copyright © {{ year }} {{ co.short }} · 保留所有权利
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import company from '@/data/company'

export default {
  name: 'CompanyLayout',
  data() {
    return { co: company, year: new Date().getFullYear() }
  }
}
</script>

<!-- 全局引入：公司站各页共用 .co-* 样式 -->
<style src="@/styles/company.css"></style>
