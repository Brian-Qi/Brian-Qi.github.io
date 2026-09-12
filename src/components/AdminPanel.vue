<template>
  <div class="admin-panel">
    <!-- ====== 加载中 ====== -->
    <div v-if="loading" class="admin-loading">
      <div class="loading-icon">⏳</div>
      <p>正在进入控制台...</p>
    </div>

    <!-- ====== 控制台主体 ====== -->
    <template v-else>
      <header class="panel-header">
        <div class="header-left">
          <span class="header-icon">🛰️</span>
          <div>
            <h1>控制台</h1>
            <p class="header-sub">
              你好，<b>{{ me.username }}</b>
              <span class="weight-tag" :class="{ super: isSuper }">
                {{ isSuper ? '👑 最高权重' : `权重 ${me.weight}` }}
              </span>
            </p>
          </div>
        </div>
        <div class="header-right">
          <button class="ghost-btn" @click="$emit('leave')">返回留言墙</button>
          <button class="ghost-btn danger" @click="doLogout">退出</button>
        </div>
      </header>

      <!-- 功能标签页 -->
      <nav class="tabs">
        <button
          v-for="tab in visibleTabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >{{ tab.icon }} {{ tab.label }}</button>
      </nav>

      <!-- ====== Tab 1: 留言管理 ====== -->
      <section v-if="activeTab === 'messages'" class="tab-panel">
        <div class="card">
          <h3>✍️ 发布留言</h3>
          <div class="publish-row">
            <input
              v-model="publishContent"
              type="text"
              placeholder="以管理员身份写点什么..."
              maxlength="200"
              @keyup.enter="doPublish"
            >
            <button @click="doPublish" :disabled="publishing || !publishContent.trim()">
              {{ publishing ? '发布中...' : '发布' }}
            </button>
          </div>
          <p class="publish-hint">署名将自动设为 <b>{{ isSuper ? '系统 ' + me.username : '管理员 ' + me.username }}</b></p>
        </div>

        <div class="card">
          <h3>🗑️ 留言列表 <span class="count-pill">共 {{ totalMessages }} 条</span></h3>
          <p v-if="messages.length === 0 && !loadingList" class="empty-tip">空空如也</p>
          <div v-for="msg in messages" :key="msg.id" class="msg-row">
            <div class="msg-main">
              <div class="msg-meta">
                <span class="msg-author" :class="{ 'admin-super': msg.author && msg.author.startsWith('系统 '), 'admin-low': msg.author && msg.author.startsWith('管理员 ') }">{{ msg.author || '匿名摸鱼人' }}</span>
                <span class="msg-date">{{ msg.date }}</span>
                <span class="msg-likes">❤ {{ msg.likes || 0 }}</span>
              </div>
              <div class="msg-content">{{ msg.content }}</div>
            </div>
            <button class="del-btn" @click="doDeleteMessage(msg.id)" title="删除">✖</button>
          </div>
          <div v-if="loadingList" class="empty-tip">加载中...</div>
          <button v-if="hasMore && !loadingList" class="load-more" @click="loadMoreMessages">加载更多</button>
        </div>
      </section>

      <!-- ====== Tab 2: 修改密码 ====== -->
      <section v-if="activeTab === 'password'" class="tab-panel">
        <div class="card narrow">
          <h3>🔑 修改密码</h3>
          <input type="password" v-model="pwForm.oldPassword" placeholder="当前密码">
          <input type="password" v-model="pwForm.newPassword" placeholder="新密码（至少 6 位）">
          <input type="password" v-model="pwForm.confirmPassword" placeholder="确认新密码" @keyup.enter="doChangePassword">
          <button class="primary-btn" @click="doChangePassword" :disabled="changingPw">
            {{ changingPw ? '修改中...' : '确认修改' }}
          </button>
          <p v-if="pwError" class="form-error">❌ {{ pwError }}</p>
          <p v-if="pwSuccess" class="form-success">✅ 密码已修改</p>
        </div>
      </section>

      <!-- ====== Tab 3: 管理员管理（仅最高权重） ====== -->
      <section v-if="activeTab === 'admins' && isSuper" class="tab-panel">
        <div class="card">
          <h3>➕ 添加管理员</h3>
          <div class="admin-form">
            <input v-model="newAdmin.username" type="text" placeholder="账号（2~32 位）" maxlength="32">
            <input v-model="newAdmin.password" type="password" placeholder="密码（至少 6 位）" maxlength="64">
            <div class="weight-picker">
              <label>权限等级</label>
              <select v-model.number="newAdmin.weight">
                <option :value="1">低权重（1 · 仅可管理留言）</option>
                <option v-for="w in midWeights" :key="w" :value="w">中权重（{{ w }}）</option>
              </select>
            </div>
            <button class="primary-btn" @click="doCreateAdmin" :disabled="creatingAdmin">
              {{ creatingAdmin ? '创建中...' : '创建' }}
            </button>
          </div>
          <p v-if="createError" class="form-error">❌ {{ createError }}</p>
          <p v-if="createSuccess" class="form-success">✅ 管理员已创建</p>
        </div>

        <div class="card">
          <h3>👥 管理员列表</h3>
          <div v-for="a in admins" :key="a.id" class="msg-row">
            <div class="msg-main">
              <div class="msg-meta">
                <span class="msg-author">{{ a.username }} <span v-if="a.username === me.username">（你）</span></span>
                <span class="weight-tag" :class="{ super: a.weight >= me.weight }">
                  {{ a.weight >= superWeight ? '👑 最高权重' : `权重 ${a.weight}` }}
                </span>
              </div>
              <div class="msg-content subtle">创建于 {{ a.createdAt }}</div>
            </div>
            <button
              v-if="a.username !== me.username"
              class="del-btn"
              @click="doDeleteAdmin(a)"
              title="删除"
            >✖</button>
          </div>
          <p v-if="admins.length === 0" class="empty-tip">加载中...</p>
        </div>
      </section>

      <!-- 低权重提示 -->
      <section v-if="activeTab === 'admins' && !isSuper" class="tab-panel">
        <div class="card narrow">
          <p class="empty-tip">🚫 权限不足，只有最高权重管理员才能管理管理员账号</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import {
  getMessages,
  addMessage,
  adminAddMessage,
  deleteMessage as apiDeleteMessage,
  adminLogout,
  adminMe,
  adminList,
  adminCreate,
  adminDelete,
  adminChangePassword
} from '../utils/messages'

const PAGE_SIZE = 15

export default {
  name: 'AdminPanel',
  emits: ['leave', 'logout'],
  setup(props, { emit }) {
    // ---- 状态 ----
    const loading = ref(true)
    const me = ref({ username: '', weight: 1 })
    const superWeight = ref(100)
    const isSuper = computed(() => me.value.weight >= superWeight.value)

    const tabs = [
      { key: 'messages', icon: '📋', label: '留言管理' },
      { key: 'password', icon: '🔑', label: '修改密码' },
      { key: 'admins', icon: '👥', label: '管理员' }
    ]
    const visibleTabs = computed(() => tabs)
    const activeTab = ref('messages')

    // ---- 留言管理 ----
    const messages = ref([])
    const totalMessages = ref(0)
    const hasMore = ref(false)
    const page = ref(1)
    const loadingList = ref(false)
    const publishContent = ref('')
    const publishing = ref(false)

    // ---- 修改密码 ----
    const pwForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const pwError = ref('')
    const pwSuccess = ref(false)
    const changingPw = ref(false)

    // ---- 管理员管理 ----
    const admins = ref([])
    const newAdmin = ref({ username: '', password: '', weight: 1 })
    const createError = ref('')
    const createSuccess = ref(false)
    const creatingAdmin = ref(false)
    const midWeights = computed(() => {
      const list = []
      for (let w = 2; w <= Math.min(49, me.value.weight - 1); w++) list.push(w)
      return list
    })

    // ---- 方法 ----
    const loadMessages = async () => {
      loadingList.value = true
      try {
        const data = await getMessages({ page: 1, pageSize: PAGE_SIZE })
        messages.value = (data && data.list) || []
        totalMessages.value = (data && data.total) || 0
        hasMore.value = !!(data && data.hasMore)
        page.value = 1
      } catch (e) {
        messages.value = []
      } finally {
        loadingList.value = false
      }
    }

    const loadMoreMessages = async () => {
      if (loadingList.value) return
      loadingList.value = true
      try {
        const data = await getMessages({ page: page.value + 1, pageSize: PAGE_SIZE })
        messages.value.push(...((data && data.list) || []))
        hasMore.value = !!(data && data.hasMore)
        totalMessages.value = (data && data.total) || 0
        page.value += 1
      } catch (e) { /* 保持现状 */ } finally {
        loadingList.value = false
      }
    }

    const loadAdmins = async () => {
      try {
        const data = await adminList()
        admins.value = (data && data.list) || []
        if (data && data.superWeight) superWeight.value = data.superWeight
      } catch (e) {
        admins.value = []
      }
    }

    const doLogout = () => {
      adminLogout()
      emit('logout')
    }

    const doPublish = async () => {
      if (!publishContent.value.trim() || publishing.value) return
      publishing.value = true
      try {
        const msg = await adminAddMessage(publishContent.value)
        if (msg && msg.id) {
          messages.value.unshift(msg)
          totalMessages.value += 1
        }
        publishContent.value = ''
      } catch (e) {
        alert('发布失败：' + (e.message || '稍后再试'))
      } finally {
        publishing.value = false
      }
    }

    const doDeleteMessage = async (id) => {
      if (!confirm('确定要删除这条留言吗？')) return
      try {
        await apiDeleteMessage(id)
        messages.value = messages.value.filter(m => m.id !== id)
        totalMessages.value = Math.max(0, totalMessages.value - 1)
      } catch (e) {
        if (e.status === 401) {
          emit('logout')
        } else {
          alert('删除失败：' + e.message)
        }
      }
    }

    const doChangePassword = async () => {
      pwError.value = ''
      pwSuccess.value = false
      const { oldPassword, newPassword, confirmPassword } = pwForm.value
      if (!oldPassword || !newPassword || !confirmPassword) {
        pwError.value = '请填写所有字段'
        return
      }
      if (newPassword.length < 6) {
        pwError.value = '新密码至少 6 位'
        return
      }
      if (newPassword !== confirmPassword) {
        pwError.value = '两次输入的新密码不一致'
        return
      }
      changingPw.value = true
      try {
        await adminChangePassword(oldPassword, newPassword)
        pwSuccess.value = true
        pwForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
        setTimeout(() => { pwSuccess.value = false }, 2000)
      } catch (e) {
        pwError.value = e.message || '修改失败'
      } finally {
        changingPw.value = false
      }
    }

    const doCreateAdmin = async () => {
      createError.value = ''
      createSuccess.value = false
      const { username, password, weight } = newAdmin.value
      if (!username || !password) {
        createError.value = '请填写账号和密码'
        return
      }
      creatingAdmin.value = true
      try {
        await adminCreate(username, password, weight)
        createSuccess.value = true
        newAdmin.value = { username: '', password: '', weight: 1 }
        loadAdmins()
        setTimeout(() => { createSuccess.value = false }, 2000)
      } catch (e) {
        if (e.status === 401) {
          emit('logout')
        } else {
          createError.value = e.message || '创建失败'
        }
      } finally {
        creatingAdmin.value = false
      }
    }

    const doDeleteAdmin = async (a) => {
      if (!confirm(`确定要删除管理员「${a.username}」吗？`)) return
      try {
        await adminDelete(a.id)
        loadAdmins()
      } catch (e) {
        if (e.status === 401) {
          emit('logout')
        } else {
          alert('删除失败：' + e.message)
        }
      }
    }

    // ---- 生命周期 ----
    onMounted(async () => {
      try {
        const profile = await adminMe()
        superWeight.value = profile.superWeight || 100
        me.value = { username: profile.username, weight: profile.weight }
        loading.value = false
        loadMessages()
        loadAdmins()
      } catch (e) {
        // token 无效，通知父组件退出
        emit('logout')
      }
    })

    return {
      loading,
      me, superWeight, isSuper,
      tabs, visibleTabs, activeTab,
      messages, totalMessages, hasMore, loadingList,
      publishContent, publishing,
      pwForm, pwError, pwSuccess, changingPw,
      admins, newAdmin, createError, createSuccess, creatingAdmin, midWeights,
      doLogout, doPublish, doDeleteMessage,
      doChangePassword, doCreateAdmin, doDeleteAdmin,
      loadMoreMessages
    }
  }
}
</script>

<style scoped>
.admin-panel {
  min-height: calc(100vh - 60px);
  background: linear-gradient(145deg, var(--app-page-gradient-start), var(--app-page-gradient-end));
  padding: 1.5rem 1.5rem 3rem;
  font-family: 'Inter', sans-serif;
  color: var(--app-text);
  max-width: 860px;
  margin: 0 auto;
}

/* ====== 覆盖全局 mobile-optimization.css 的 !important 干扰 ====== */
.admin-panel .ghost-btn {
  min-height: auto !important;
  min-width: auto !important;
  padding: 0.45rem 1.1rem !important;
  width: auto !important;
}
.admin-panel .tab-btn {
  min-height: auto !important;
  min-width: auto !important;
  padding: 0.55rem 1.3rem !important;
  width: auto !important;
}
.admin-panel .del-btn {
  min-height: auto !important;
  min-width: auto !important;
  padding: 0.2rem 0.4rem !important;
  width: auto !important;
}
.admin-panel .load-more {
  width: auto !important;
  min-height: auto !important;
  min-width: auto !important;
  padding: 0.5rem 1.5rem !important;
}
.admin-panel .publish-row button {
  width: auto !important;
  min-height: auto !important;
  min-width: auto !important;
  padding: 0.75rem 1.6rem !important;
}
.admin-panel .primary-btn {
  min-height: auto !important;
  padding: 0.8rem !important;
}
.admin-panel .publish-row input,
.admin-panel .card input,
.admin-panel .card select {
  min-height: auto !important;
  padding: 0.8rem 0.9rem !important;
}

/* ====== 加载状态 ====== */
.admin-loading {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--app-accent-text);
}
.loading-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ====== 头部 ====== */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.header-left { display: flex; align-items: center; gap: 1rem; }
.header-icon { font-size: 2.2rem; }
.panel-header h1 {
  font-size: 1.9rem;
  margin: 0;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-sub { margin: 0.2rem 0 0; color: var(--app-accent-text); font-size: 0.9rem; }
.header-sub b { color: #ff69b4; }
.header-right { display: flex; gap: 0.6rem; }
.ghost-btn {
  padding: 0.45rem 1.1rem;
  background: var(--app-btn-secondary-bg);
  color: var(--app-accent-text);
  border: 1px solid var(--app-divider);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}
.ghost-btn:hover { border-color: #ff69b4; color: #ff69b4; transform: scale(1.05); }
.ghost-btn.danger:hover { border-color: #ff6b6b; color: #ff6b6b; }

/* ====== 标签页 ====== */
.tabs {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 0.55rem 1.3rem;
  background: var(--app-btn-secondary-bg);
  border: 1px solid var(--app-divider);
  border-radius: 24px;
  color: var(--app-accent-text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tab-btn:hover { border-color: #ff69b4; color: #ff69b4; }
.tab-btn.active {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.25), rgba(138, 109, 233, 0.25));
  border-color: #ff69b4;
  color: #ff69b4;
  font-weight: bold;
}

/* ====== 卡片 ====== */
.card {
  background: var(--app-container-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--app-divider);
  border-radius: 16px;
  padding: 1.4rem;
  margin-bottom: 1.2rem;
}
.card.narrow { max-width: 440px; }
.card h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: var(--app-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.count-pill {
  font-size: 0.75rem;
  font-weight: normal;
  color: var(--app-accent-text);
  background: var(--app-btn-secondary-bg);
  border: 1px solid var(--app-divider);
  padding: 0.1rem 0.6rem;
  border-radius: 12px;
}

/* 留言管理 */
.publish-row { display: flex; gap: 0.7rem; flex-wrap: wrap; }
.publish-row input {
  flex: 1;
  min-width: 140px;
  padding: 0.75rem 0.9rem;
  background: var(--app-input-bg);
  border: 2px solid var(--app-input-border);
  border-radius: 10px;
  color: var(--app-text);
  box-sizing: border-box;
}
.publish-row input:focus { outline: none; border-color: #ff69b4; }
.publish-row button {
  padding: 0.75rem 1.6rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.publish-row button:hover:not(:disabled) { transform: scale(1.04); }
.publish-row button:disabled { opacity: 0.5; cursor: not-allowed; }

.msg-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.8rem 0.6rem;
  border-bottom: 1px solid var(--app-divider);
}
.msg-row:last-of-type { border-bottom: none; }
.msg-main { flex: 1; min-width: 0; }
.msg-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.82rem;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
}
.msg-author { color: #ff69b4; font-weight: bold; }
.msg-author.admin-super {
  background: linear-gradient(90deg, #FFD700, #DAA520, #FFD700);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.msg-author.admin-low {
  background: linear-gradient(90deg, #FFD700, #DAA520, #FFD700);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: normal;
}
.publish-hint { font-size: 0.8rem; color: var(--app-accent-text); margin: 0.5rem 0 0; }
.publish-hint b {
  background: linear-gradient(90deg, #FFD700, #DAA520, #FFD700);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.msg-date, .msg-likes { color: var(--app-accent-text); }
.msg-content { font-size: 0.95rem; line-height: 1.5; word-break: break-word; }
.msg-content.subtle { color: var(--app-accent-text); font-size: 0.85rem; }
.del-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  transition: all 0.2s ease;
}
.del-btn:hover { transform: scale(1.25); color: #ff0000; }
.empty-tip { text-align: center; color: var(--app-accent-text); padding: 1.2rem; }
.load-more {
  display: block;
  margin: 0.8rem auto 0;
  padding: 0.5rem 1.5rem;
  background: var(--app-btn-secondary-bg);
  color: var(--app-accent-text);
  border: 1px solid var(--app-divider);
  border-radius: 24px;
  cursor: pointer;
}
.load-more:hover { border-color: #ff69b4; color: #ff69b4; }

/* 权重标签 */
.weight-tag {
  font-size: 0.72rem;
  padding: 0.1rem 0.55rem;
  border-radius: 10px;
  border: 1px solid var(--app-divider);
  color: var(--app-accent-text);
  background: var(--app-btn-secondary-bg);
}
.weight-tag.super {
  color: #ffd76b;
  border-color: rgba(255, 215, 107, 0.5);
  background: rgba(255, 215, 107, 0.1);
}

/* 修改密码 / 管理员表单 */
.card input, .card select {
  width: 100%;
  padding: 0.8rem 0.9rem;
  background: var(--app-input-bg);
  border: 2px solid var(--app-input-border);
  border-radius: 10px;
  color: var(--app-text);
  font-size: 0.95rem;
  margin-bottom: 0.9rem;
  box-sizing: border-box;
}
.card input:focus, .card select:focus { outline: none; border-color: #ff69b4; }
.card select option { background: var(--app-input-bg); color: var(--app-text); }
.primary-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.primary-btn:hover:not(:disabled) { transform: scale(1.02); }
.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.admin-form .weight-picker { margin-bottom: 0.9rem; }
.weight-picker label {
  display: block;
  font-size: 0.85rem;
  color: var(--app-accent-text);
  margin-bottom: 0.4rem;
}
.form-error { color: #ff6b6b; font-size: 0.88rem; margin: 0.6rem 0 0; }
.form-success { color: #69ffb4; font-size: 0.88rem; margin: 0.6rem 0 0; }

@media (max-width: 600px) {
  .admin-panel { padding: 1.2rem 1rem 2.5rem; }
  .panel-header h1 { font-size: 1.5rem; }
  .header-icon { font-size: 1.8rem; }
  .publish-row button { flex: 1 0 100%; }
  .tabs { gap: 0.4rem; }
  .tab-btn { padding: 0.45rem 0.9rem; font-size: 0.85rem; }
}
</style>
