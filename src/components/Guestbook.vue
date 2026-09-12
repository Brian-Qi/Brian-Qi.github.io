<template>
  <div class="guestbook">
    <AdminPanel v-if="isAdmin" @leave="onAdminLeave" @logout="onAdminLogout" />
    <template v-else>
      <h1
        :class="{ pressing: isPressing }"
        @mousedown="startPress"
        @mouseup="cancelPress"
        @mouseleave="cancelPress"
        @touchstart="startPress"
        @touchmove="cancelPress"
        @touchend="cancelPress"
        @touchcancel="cancelPress"
      >
        📝 摸鱼留言墙
      </h1>

      <div class="messages-container">
        <div v-if="messages.length === 0 && !loadingList" class="no-messages">
          <p>✨ 还没有留言，来当第一个吧！</p>
        </div>
        <div v-for="msg in messages" :key="msg.id" class="message-card">
          <div class="message-header">
            <span
              class="message-author"
              :class="{
                'admin-super': msg.author && msg.author.startsWith('系统 '),
                'admin-low': msg.author && msg.author.startsWith('管理员 ')
              }"
              >{{ msg.author || '匿名摸鱼人' }}</span
            >
            <div class="message-actions">
              <button
                class="like-btn"
                :class="{ liked: likedIds.includes(msg.id) }"
                :disabled="likedIds.includes(msg.id)"
                :title="likedIds.includes(msg.id) ? '已经赞过啦' : '点个赞'"
                @click="likeMessage(msg)"
              >
                {{ likedIds.includes(msg.id) ? '❤' : '🤍' }} {{ msg.likes || 0 }}
              </button>
              <span class="message-date">{{ msg.date }}</span>
            </div>
          </div>
          <div class="message-content">{{ msg.content }}</div>
        </div>

        <div v-if="loadingList" class="loading-more">加载中...</div>
        <div v-if="hasMore && !loadingList" class="load-more">
          <button class="load-more-btn" @click="loadMore">加载更多留言</button>
        </div>
      </div>

      <div class="message-input-section">
        <div class="message-warning">
          ⚠️ 请友善发言，请勿刷屏、广告或违规内容。每条留言都会公开显示。
        </div>
        <div class="signature-toggle">
          <label class="toggle-switch">
            <input type="checkbox" v-model="showSignature" />
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label">开启署名</span>
        </div>
        <div v-if="showSignature" class="signature-input">
          <input
            v-model="signature"
            type="text"
            placeholder="输入你的大名（留空则显示匿名）"
            maxlength="20"
          />
        </div>
        <div class="message-input-row">
          <input
            v-model="newMessage"
            type="text"
            placeholder="写点什么吧..."
            maxlength="200"
            :disabled="loading"
            @keyup.enter="submitNewMessage"
          />
          <button @click="submitNewMessage" :disabled="loading || !newMessage.trim()">
            {{ loading ? '发布中...' : '发布' }}
          </button>
        </div>
        <div class="char-count" :class="{ warn: newMessage.length > 180 }">
          {{ newMessage.length }}/200
        </div>
      </div>

      <div class="button-container">
        <router-link to="/who_i_am/secret_quiz/secret_room" class="return-button">
          <span class="button-icon">🔙</span> 返回秘密空间
        </router-link>
      </div>

      <transition name="login-fade">
        <div v-if="showLogin" class="login-overlay" @click.self="closeLogin">
          <div class="login-card">
            <div class="login-logo">🔐</div>
            <h2>控制台</h2>
            <p class="login-sub">此路不通，闲人免进</p>
            <input
              type="text"
              v-model="loginForm.username"
              placeholder="账号"
              maxlength="32"
              @keyup.enter="$refs.pwInput && $refs.pwInput.focus()"
            />
            <input
              type="password"
              v-model="loginForm.password"
              placeholder="密码"
              ref="pwInput"
              @keyup.enter="doLogin"
            />
            <button class="login-btn" @click="doLogin" :disabled="loggingIn">
              {{ loggingIn ? '验证中...' : '进入' }}
            </button>
            <p v-if="loginError" class="login-form-error">❌ {{ loginError }}</p>
            <button class="login-cancel" @click="closeLogin">取消</button>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AdminPanel from './AdminPanel.vue'
import {
  fetchMessages,
  postMessage,
  likeMessage as likeMessageApi,
  isMessageLiked,
  hasAdminToken,
  clearAdminToken,
  adminLogin,
  adminMe
} from '../utils/guestbook-api'

const PAGE_SIZE = 10
const PRESS_DURATION = 3000

export default {
  name: 'Guestbook',
  components: { AdminPanel },
  setup() {
    const messages = ref([])
    const newMessage = ref('')
    const showSignature = ref(false)
    const signature = ref('')
    const loading = ref(false)
    const loadingList = ref(false)
    const hasMore = ref(false)
    const page = ref(1)
    const likedIds = ref([])

    const isAdmin = ref(false)
    const showLogin = ref(false)
    const loggingIn = ref(false)
    const loginForm = ref({ username: '', password: '' })
    const loginError = ref('')
    const pwInput = ref(null)
    const isPressing = ref(false)

    let pressTimer = null

    const syncLikedIds = () => {
      likedIds.value = messages.value.filter((m) => isMessageLiked(m.id)).map((m) => m.id)
    }

    const loadMessages = async () => {
      loadingList.value = true
      try {
        const res = await fetchMessages({ page: 1, pageSize: PAGE_SIZE })
        messages.value = (res && res.list) || []
        hasMore.value = !!(res && res.hasMore)
        page.value = 1
        syncLikedIds()
      } catch (e) {
        messages.value = []
        hasMore.value = false
      } finally {
        loadingList.value = false
      }
    }

    const loadMore = async () => {
      if (loadingList.value) return
      loadingList.value = true
      try {
        const res = await fetchMessages({ page: page.value + 1, pageSize: PAGE_SIZE })
        const list = (res && res.list) || []
        messages.value.push(...list)
        hasMore.value = !!(res && res.hasMore)
        page.value += 1
        syncLikedIds()
      } catch (e) {
        // 忽略
      } finally {
        loadingList.value = false
      }
    }

    const submitNewMessage = async () => {
      if (!newMessage.value.trim() || loading.value) return
      loading.value = true
      try {
        const res = await postMessage(newMessage.value, signature.value.trim())
        if (res && res.id) {
          messages.value.unshift(res)
          syncLikedIds()
        }
        newMessage.value = ''
        signature.value = ''
        showSignature.value = false
      } catch (e) {
        alert('留言失败：' + (e.message || '请稍后重试'))
      } finally {
        loading.value = false
      }
    }

    const likeMessage = async (msg) => {
      if (likedIds.value.includes(msg.id)) return
      try {
        const res = await likeMessageApi(msg.id)
        msg.likes = res.likes
        likedIds.value.push(msg.id)
      } catch (e) {
        // 忽略
      }
    }

    const startPress = () => {
      isPressing.value = true
      pressTimer = setTimeout(() => {
        isPressing.value = false
        pressTimer = null
        if (hasAdminToken()) isAdmin.value = true
        else showLogin.value = true
      }, PRESS_DURATION)
    }

    const cancelPress = () => {
      isPressing.value = false
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    const closeLogin = () => {
      showLogin.value = false
      loginForm.value = { username: '', password: '' }
      loginError.value = ''
    }

    const doLogin = async () => {
      if (!loginForm.value.username || !loginForm.value.password) {
        loginError.value = '请输入账号和密码'
        return
      }
      loggingIn.value = true
      loginError.value = ''
      try {
        await adminLogin(loginForm.value.username, loginForm.value.password)
        loginForm.value = { username: '', password: '' }
        showLogin.value = false
        isAdmin.value = true
      } catch (e) {
        loginError.value = e.message || '账号或密码不对哦'
      } finally {
        loggingIn.value = false
      }
    }

    const onAdminLeave = () => {
      isAdmin.value = false
    }

    const onAdminLogout = () => {
      clearAdminToken()
      isAdmin.value = false
    }

    onMounted(() => {
      loadMessages()
      if (hasAdminToken()) {
        adminMe()
          .then(() => {
            isAdmin.value = true
          })
          .catch(() => {
            clearAdminToken()
          })
      }
    })

    onBeforeUnmount(() => {
      if (pressTimer) clearTimeout(pressTimer)
    })

    return {
      messages,
      newMessage,
      showSignature,
      signature,
      loading,
      loadingList,
      hasMore,
      likedIds,
      loadMore,
      likeMessage,
      submitNewMessage,
      isAdmin,
      isPressing,
      showLogin,
      loggingIn,
      loginForm,
      loginError,
      pwInput,
      startPress,
      cancelPress,
      closeLogin,
      doLogin,
      onAdminLeave,
      onAdminLogout
    }
  }
}
</script>

<style scoped>
.guestbook{min-height:calc(100vh - 60px);background:linear-gradient(145deg,var(--app-page-gradient-start),var(--app-page-gradient-end));padding:1.5rem 2rem 2rem;font-family:Inter,sans-serif;color:var(--app-text);transition:background var(--app-transition),color var(--app-transition)}
.guestbook .like-btn{min-height:auto!important;min-width:auto!important;padding:.15rem .7rem!important;width:auto!important}
.guestbook .load-more-btn{width:auto!important;min-height:auto!important;min-width:auto!important;padding:.5rem 1.5rem!important}
.guestbook .message-input-row input{width:auto!important;flex:1!important;min-height:auto!important;padding:1rem!important}
.guestbook .message-input-row button{width:auto!important;min-height:auto!important;min-width:auto!important;padding:1rem 2rem!important}
.guestbook .signature-input input{min-height:auto!important;padding:.8rem!important}
.guestbook .return-button{width:auto!important;min-height:auto!important;min-width:auto!important;padding:.8rem 2rem!important}
.guestbook .login-card input{min-height:auto!important;padding:.9rem 1rem!important}
.guestbook .login-btn{min-height:auto!important;padding:.9rem!important}
.guestbook .login-cancel{min-height:auto!important;min-width:auto!important;padding:0!important;width:auto!important}
h1{text-align:center;font-size:2.5rem;color:#ff69b4;margin-bottom:2rem;-moz-user-select:none;user-select:none;-webkit-user-select:none;cursor:default}
h1.pressing{animation:title-press-glow-e714187c 3s ease-in forwards}
.messages-container{max-width:600px;margin:0 auto 2rem}
.no-messages{text-align:center;padding:3rem;background:rgba(0,0,0,.3);border-radius:24px;color:var(--app-accent-text);font-size:1.2rem}
.message-card{background:var(--app-container-bg);backdrop-filter:blur(12px);border:1px solid var(--app-divider);border-radius:16px;padding:1rem;margin-bottom:1rem;position:relative;transition:background var(--app-transition),border-color var(--app-transition)}
.message-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;font-size:.9rem}
.message-author{color:#ff69b4;font-weight:700}
.message-author.admin-super{font-weight:700}
.message-author.admin-low,.message-author.admin-super{background:linear-gradient(90deg,gold,#daa520,gold);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.message-author.admin-low{font-weight:400}
.message-date{color:var(--app-accent-text)}
.message-content{color:var(--app-text);line-height:1.5}
.message-actions{display:flex;align-items:center;gap:.5rem}
.like-btn{background:none;border:1px solid var(--app-divider);border-radius:16px;color:var(--app-accent-text);font-size:.85rem;cursor:pointer;padding:.15rem .7rem;transition:all .2s ease}
.like-btn:hover:not(:disabled){transform:scale(1.1);border-color:#ff69b4;color:#ff69b4}
.like-btn.liked{color:#ff69b4;border-color:rgba(255,105,180,.5);cursor:default}
.loading-more{text-align:center;color:var(--app-accent-text);padding:1rem}
.load-more{text-align:center;margin:.5rem 0 1rem}
.load-more-btn{padding:.5rem 1.5rem;background:var(--app-btn-secondary-bg);color:var(--app-accent-text);border:1px solid var(--app-divider);border-radius:30px;cursor:pointer;transition:all .2s ease}
.load-more-btn:hover{transform:scale(1.05);border-color:#ff69b4}
.char-count{text-align:right;font-size:.8rem;color:var(--app-accent-text);margin-top:.4rem;opacity:.7}
.char-count.warn{color:#ffb36b;opacity:1}
.message-input-section{max-width:600px;margin:0 auto 2rem}
.message-warning{background:rgba(255,105,180,.1);border-left:4px solid #ff69b4;padding:.8rem 1rem;margin-bottom:1rem;border-radius:8px;font-size:.85rem;color:#ffb6c1}
.signature-toggle{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.toggle-switch{position:relative;display:inline-block;width:50px;height:24px}
.toggle-switch input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--app-input-bg);border:1px solid var(--app-input-border);border-radius:24px;transition:.3s}
.toggle-slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:2px;background-color:var(--app-accent-text);border-radius:50%;transition:.3s}
input:checked+.toggle-slider{background-color:#ff69b4;border-color:#ff69b4}
input:checked+.toggle-slider:before{transform:translateX(26px);background-color:#fff}
.toggle-label{color:var(--app-text)}
.signature-input{margin-bottom:1rem}
.signature-input input{width:100%;padding:.8rem;background:var(--app-input-bg);border:2px solid var(--app-input-border);border-radius:12px;color:var(--app-text)}
.signature-input input:focus{outline:none;border-color:#ff69b4}
.message-input-row{display:flex;gap:1rem}
.message-input-row input{flex:1;padding:1rem;background:var(--app-input-bg);border:2px solid var(--app-input-border);border-radius:12px;color:var(--app-text);font-size:1rem}
.message-input-row input:focus{outline:none;border-color:#ff69b4}
.message-input-row input:disabled{opacity:.5;cursor:not-allowed}
.message-input-row button{padding:1rem 2rem;background:linear-gradient(135deg,#ff69b4,#8a6de9);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .3s ease}
.message-input-row button:hover:not(:disabled){transform:scale(1.05);box-shadow:0 0 20px rgba(255,105,180,.3)}
.message-input-row button:disabled{opacity:.5;cursor:not-allowed}
.button-container{display:flex;justify-content:center;margin-top:2rem}
.return-button{padding:.8rem 2rem;border-radius:40px;font-size:1.1rem;text-decoration:none;display:flex;align-items:center;gap:.5rem;background:#1a2f4a;color:#6ab0ff;border:1px solid #3a6a9a;transition:all .3s ease}
.return-button:hover{background:#2a4a6a;transform:scale(1.05);box-shadow:0 0 20px rgba(106,176,255,.3)}
.button-icon{font-size:1.2rem}
.login-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000}
.login-card{width:100%;max-width:360px;background:var(--app-container-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--app-divider);border-radius:24px;padding:2.5rem 2rem;text-align:center}
.login-logo{font-size:3rem;margin-bottom:.5rem}
.login-card h2{font-size:1.8rem;background:linear-gradient(135deg,#ff69b4,#8a6de9);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 .3rem}
.login-sub{color:var(--app-accent-text);font-size:.85rem;margin-bottom:1.5rem}
.login-card input{width:100%;padding:.9rem 1rem;background:var(--app-input-bg);border:2px solid var(--app-input-border);border-radius:12px;color:var(--app-text);font-size:1rem;margin-bottom:1rem;box-sizing:border-box}
.login-card input:focus{outline:none;border-color:#ff69b4}
.login-btn{width:100%;padding:.9rem;background:linear-gradient(135deg,#ff69b4,#8a6de9);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .25s ease}
.login-btn:hover:not(:disabled){transform:scale(1.03);box-shadow:0 0 20px rgba(255,105,180,.35)}
.login-btn:disabled{opacity:.6;cursor:not-allowed}
.login-form-error{color:#ff6b6b;font-size:.88rem;margin:.6rem 0 0}
.login-cancel{display:inline-block;margin-top:1.2rem;color:var(--app-accent-text);font-size:.85rem;background:none;border:none;cursor:pointer;opacity:.8}
.login-cancel:hover{color:#ff69b4;opacity:1}
.login-fade-enter-active,.login-fade-leave-active{transition:opacity .25s ease}
.login-fade-enter-from,.login-fade-leave-to{opacity:0}
@media (max-width:600px){h1{font-size:2rem}.message-input-row{flex-direction:column}.login-card{margin:0 1rem}}
</style>
