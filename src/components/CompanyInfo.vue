<template>
  <div class="company-card">
    <!-- 头部封条 -->
    <div class="card-ribbon">
      <span>我的工作室</span>
    </div>

    <!-- 标题区 (全宽) -->
    <div class="card-header">
      <h1>杭州市拱墅区彼岸时墟游戏工作室</h1>
      <p class="subtitle">个体工商户 · 游戏开发与数字创意</p>
    </div>

    <!-- 左右分栏主体 -->
    <div class="card-body">
      <!-- 左栏：关键信息 + 详情表格 + 返回 -->
      <div class="card-left">
        <!-- 关键信息卡片 2x2 -->
        <div class="highlight-cards">
          <div class="hl-card">
            <span class="hl-label">统一社会信用代码</span>
            <span class="hl-value mono">92330105MAKDBGY136</span>
          </div>
          <div class="hl-card">
            <span class="hl-label">注册号</span>
            <span class="hl-value mono">330105601558403</span>
          </div>
          <div class="hl-card">
            <span class="hl-label">经营者</span>
            <span class="hl-value">祁思皓</span>
          </div>
          <div class="hl-card">
            <span class="hl-label">成立日期</span>
            <span class="hl-value">2026 年 5 月 11 日</span>
          </div>
        </div>

        <!-- 详情表格 -->
        <table class="detail-table">
          <tr>
            <td class="dt-label">类型</td>
            <td class="dt-value">个体工商户</td>
            <td class="dt-label">组成形式</td>
            <td class="dt-value">个人经营</td>
          </tr>
          <tr>
            <td class="dt-label">登记机关</td>
            <td class="dt-value" colspan="3">杭州市拱墅区市场监督管理局</td>
          </tr>
          <tr>
            <td class="dt-label">登记状态</td>
            <td class="dt-value dt-active" colspan="3">存续</td>
          </tr>
        </table>

        <!-- 关闭按钮 -->
        <div class="footer-return">
          <button class="return-btn" @click="$emit('close')">
            ← 关闭
          </button>
        </div>
      </div>

      <!-- 右栏：经营范围 -->
      <div class="card-right">
        <div class="scope-block">
          <div class="scope-title">经营范围</div>
          <p class="scope-text">一般项目：数字文化创意软件开发；数字文化创意内容应用服务；数字文化创意技术装备销售；数字内容制作服务（不含出版发行）；文化场馆用智能设备制造；计算机软硬件及外围设备制造；软件开发；大数据服务；数据处理和存储支持服务；信息技术咨询服务；动漫游戏开发；非物质文化遗产保护；软件销售；软件外包服务；人工智能基础软件开发；网络与信息安全软件开发；区块链技术相关软件和服务；人工智能应用软件开发；人工智能理论与算法软件开发；技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；建筑信息模型技术开发、技术咨询、技术服务</p>
          <p class="scope-note">（依法须经批准的项目，经相关部门批准后方可开展经营活动）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyInfo',
  emits: ['close']
}
</script>

<style scoped>
/* ============================================
   CompanyInfo — 风格统一为 NewIndex 暗色毛玻璃
   ============================================ */
.company-card {
  max-width: 860px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
}

/* ---------- 顶部封条 ---------- */
.card-ribbon {
  background: linear-gradient(135deg, #a78bfa, #6366f1);
  color: #fff;
  text-align: center;
  padding: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* ---------- 标题区 ---------- */
.card-header {
  text-align: center;
  padding: 1.25rem 2rem 0;
}

.card-header h1 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  line-height: 1.4;
  margin: 0 auto 0.3rem;
}

.subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* ========== 左右分栏主体 ========== */
.card-body {
  display: flex;
  gap: 1.25rem;
  padding: 1rem 1.5rem 1.5rem;
}

.card-left {
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
}

.card-right {
  flex: 1;
  min-width: 0;
}

/* ---------- 关键信息卡片 ---------- */
.highlight-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.hl-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 0.55rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  transition: all 0.3s;
  transform: scale(1);
}

.hl-card:hover {
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(0, 0, 0, 0.3);
  transform: scale(1.02);
}

.hl-label {
  font-size: 0.66rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.hl-value {
  font-size: 0.85rem;
  color: #e2e8f0;
  font-weight: 600;
}

.hl-value.mono {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  word-break: break-all;
}

/* ---------- 详情表格 ---------- */
.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: auto;
}

.detail-table td {
  padding: 0.45rem 0.35rem;
  font-size: 0.8rem;
  vertical-align: top;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.detail-table tr:last-child td {
  border-bottom: none;
}

.dt-label {
  color: #94a3b8;
  font-weight: 500;
  width: 65px;
  white-space: nowrap;
}

.dt-value {
  color: #cbd5e1;
  font-weight: 500;
  line-height: 1.4;
}

.dt-active {
  color: #a78bfa !important;
  font-weight: 600;
}

/* ---------- 经营范围 ---------- */
.scope-block {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 0.8rem 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.scope-block:hover {
  border-color: rgba(167, 139, 250, 0.3);
}

.scope-title {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
}

.scope-text {
  font-size: 0.82rem;
  color: #cbd5e1;
  line-height: 1.7;
  flex: 1;
  margin: 0;
}

.scope-note {
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: #94a3b8;
  font-style: italic;
  flex-shrink: 0;
}

/* ---------- 底部关闭按钮 ---------- */
.footer-return {
  padding-top: 0.75rem;
  display: flex;
  justify-content: center;
}

.return-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #a78bfa, #6366f1);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 10px rgba(167, 139, 250, 0.25);
}

.return-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(167, 139, 250, 0.4);
}

.return-btn:active {
  transform: scale(0.97);
}

/* ---------- 响应式：窄屏回退上下布局 ---------- */
@media (max-width: 700px) {
  .company-card {
    border-radius: 6px;
    max-height: 85vh;
  }

  .card-header {
    padding: 0.75rem 1rem 0;
  }

  .card-header h1 {
    font-size: 0.95rem;
  }

  .card-body {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem 1rem 1rem;
  }

  .card-left {
    flex: none;
  }

  .highlight-cards {
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .detail-table td {
    padding: 0.35rem 0.25rem;
    font-size: 0.73rem;
  }

  .dt-label {
    width: 58px;
  }

  .scope-block {
    padding: 0.65rem 0.8rem;
  }

  .scope-text {
    font-size: 0.76rem;
    line-height: 1.55;
  }

  .footer-return {
    padding-top: 0.5rem;
  }

  .return-btn {
    width: 100%;
    justify-content: center;
    padding: 0.55rem;
  }
}
</style>
