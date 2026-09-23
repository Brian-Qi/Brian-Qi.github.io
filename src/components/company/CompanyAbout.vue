<template>
  <div>
    <section class="co-hero">
      <span class="co-kicker">关于我们</span>
      <h1>{{ co.short }}</h1>
      <p class="co-sub">{{ co.en }} · 一家专注游戏与数字创意的小工作室。</p>
    </section>

    <section class="co-section">
      <h2 class="co-h2">工作室</h2>
      <p class="co-lead">
        {{ co.name }} 成立于 {{ co.founded }}，是一家以 {{ co.form }} 形式登记的{{ co.type }}，
        主营游戏开发与数字创意内容。规模不大，但完整：从玩法原型、程序实现，到视觉呈现与上线部署，都能自己走完。
      </p>
      <p class="co-lead">
        我们相信「小而完整」的力量——不追求规模，追求把一件东西做扎实，然后把它交到用户手里。
        近年也在民俗与非物质文化遗产的数字化方向持续投入，让散落的旧物有一条归处。
      </p>
    </section>

    <section class="co-section">
      <h2 class="co-h2">经营者</h2>
      <div class="co-grid">
        <div class="co-card">
          <h3>{{ co.operator }}</h3>
          <p>工作室经营者 · 开发者</p>
          <div class="co-tags">
            <span class="co-tag">游戏开发</span>
            <span class="co-tag">前端 / 交互</span>
            <span class="co-tag">数字内容</span>
          </div>
        </div>
        <div class="co-card">
          <h3>怎么干活</h3>
          <p>先把问题想清楚，再动手；先有可验证的目标，再谈实现。做东西以「能玩、能用、能看懂」为准。</p>
        </div>
      </div>
    </section>

    <section class="co-section">
      <h2 class="co-h2">工商登记信息</h2>
      <p class="co-lead">以下信息以市场监督管理部门登记为准。</p>
      <table class="co-table">
        <tbody>
          <tr><th>名称</th><td>{{ co.name }}</td></tr>
          <tr><th>类型</th><td>{{ co.type }}（{{ co.form }}）</td></tr>
          <tr><th>经营者</th><td>{{ co.operator }}</td></tr>
          <tr><th>统一社会信用代码</th><td class="co-mono">{{ co.creditCode }}</td></tr>
          <tr><th>注册号</th><td class="co-mono">{{ co.regNo }}</td></tr>
          <tr><th>成立日期</th><td>{{ co.founded }}</td></tr>
          <tr><th>登记机关</th><td>{{ co.authority }}</td></tr>
          <tr><th>登记状态</th><td class="co-status">{{ co.status }}</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import company from '@/data/company'

export default {
  name: 'CompanyAbout',
  data() {
    return { co: company }
  }
}
</script>
