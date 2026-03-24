<template>
  <div class="guestbook">
    <h1>📝 摸鱼留言墙</h1>
    
    <!-- 管理员入口按钮（非管理员模式下显示） -->
    <div v-if="!isAdmin" class="admin-entrance">
      <button @click="showAdminPasswordDialog = true" class="admin-entrance-button">
        <span class="button-icon">🔑</span>
        管理员入口
      </button>
    </div>
    
    <!-- 管理员标识 -->
    <div v-if="isAdmin" class="admin-badge">
      🔑 管理员模式
      <button @click="exitAdmin" class="exit-admin">退出管理员</button>
    </div>
    
    <!-- 密码弹窗 -->
    <div v-if="showAdminPasswordDialog" class="password-dialog-overlay" @click.self="showAdminPasswordDialog = false">
      <div class="password-dialog">
        <h3>🔒 管理员验证</h3>
        <input 
          type="password" 
          v-model="adminPassword" 
          placeholder="输入密码"
          @keyup.enter="checkAdminPassword"
          ref="passwordInput"
        >
        <div class="dialog-buttons">
          <button @click="showAdminPasswordDialog = false">取消</button>
          <button @click="checkAdminPassword" class="confirm-btn">确认</button>
        </div>
        <p v-if="passwordError" class="password-error">❌ 密码错误</p>
      </div>
    </div>
    
    <!-- 留言列表 -->
    <div class="messages-container">
      <div v-if="messages.length === 0" class="no-messages">
        <p>✨ 还没有留言，来当第一个吧！</p>
      </div>
      <div v-for="msg in messages" :key="msg.id" class="message-card">
        <div class="message-header">
          <span class="message-author">{{ msg.author || '匿名摸鱼人' }}</span>
          <span class="message-date">{{ msg.date }}</span>
          <button v-if="isAdmin" @click.stop="deleteMessage(msg.id)" class="delete-btn">✖</button>
        </div>
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>

    <!-- 普通用户留言输入区域 -->
    <div v-if="!isAdmin" class="message-input-section">
      <!-- 警示文案 -->
      <div class="message-warning">
        ⚠️ 请友善发言，请勿刷屏、广告或违规内容。每条留言都会公开显示。
      </div>
      <div class="signature-toggle">
        <label class="toggle-switch">
          <input type="checkbox" v-model="showSignature">
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
        >
      </div>
      <div class="message-input-row">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="写点什么吧..."
          @keyup.enter="submitNewMessage"
          :disabled="loading"
        >
        <button @click="submitNewMessage" :disabled="loading">
          {{ loading ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="button-container">
      <router-link to="/who_i_am/secret_quiz/secret_room" class="return-button">
        <span class="button-icon">🔙</span>
        返回秘密空间
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getMessages, addMessage, deleteMessage as supabaseDeleteMessage } from '../utils/supabase'

export default {
  name: 'Guestbook',
  setup() {
    const route = useRoute()
    const messages = ref([])
    const newMessage = ref('')
    const showSignature = ref(false)
    const signature = ref('')
    const loading = ref(false)
    const isAdmin = ref(false)
    const showAdminPasswordDialog = ref(false)
    const adminPassword = ref('')
    const passwordError = ref(false)
    const passwordInput = ref(null)
    let isDeleting = false

    if (route.query.admin === 'true') {
      // isAdmin.value = true
    }

    const exitAdmin = () => {
      isAdmin.value = false
      window.history.replaceState({}, '', '/guestbook')
    }

    const checkAdminPassword = async () => {
      const ADMIN_PASSWORD = '852573131Mm@'
      if (adminPassword.value === ADMIN_PASSWORD) {
        isAdmin.value = true
        showAdminPasswordDialog.value = false
        adminPassword.value = ''
        passwordError.value = false
        window.history.replaceState({}, '', '/guestbook?admin=true')
      } else {
        passwordError.value = true
        adminPassword.value = ''
        await nextTick()
        passwordInput.value?.focus()
      }
    }

    const loadMessages = async () => {
      try {
        const data = await getMessages()
        messages.value = data || []
      } catch (error) {
        console.error('加载留言失败:', error)
        alert('加载留言失败：' + error.message)
      }
    }

    const submitNewMessage = async () => {
      if (!newMessage.value.trim()) return
      if (loading.value) return
      loading.value = true
      try {
        const newMsg = await addMessage(
          newMessage.value,
          signature.value.trim() || '匿名摸鱼人'
        )
        if (newMsg && newMsg.id) {
          messages.value.unshift(newMsg)
        }
        newMessage.value = ''
        signature.value = ''
        showSignature.value = false
      } catch (error) {
        alert('留言失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    const deleteMessage = async (id) => {
      if (isDeleting) return
      isDeleting = true
      
      const confirmed = confirm('确定要删除这条留言吗？')
      if (!confirmed) {
        isDeleting = false
        return
      }
      
      try {
        await supabaseDeleteMessage(id)
        messages.value = messages.value.filter(msg => msg.id !== id)
      } catch (error) {
        alert('删除失败：' + error.message)
      } finally {
        isDeleting = false
      }
    }

    onMounted(() => {
      loadMessages()
    })

    return {
      messages,
      newMessage,
      showSignature,
      signature,
      loading,
      isAdmin,
      showAdminPasswordDialog,
      adminPassword,
      passwordError,
      passwordInput,
      exitAdmin,
      checkAdminPassword,
      submitNewMessage,
      deleteMessage
    }
  }
}
</script>

<style scoped>
.guestbook {
  min-height: 100vh;
  background: linear-gradient(145deg, #1a1f2a, #2a1f2a);
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #e1e7ef;
}
h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #ff69b4;
  margin-bottom: 2rem;
}
.admin-entrance {
  max-width: 600px;
  margin: 0 auto 1rem;
  text-align: right;
}
.admin-entrance-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 1rem;
  background: #1f2a36;
  color: #8f9eff;
  text-decoration: none;
  border-radius: 30px;
  font-size: 0.9rem;
  border: 1px solid #31465c;
  transition: all 0.2s ease;
  cursor: pointer;
}
.admin-entrance-button:hover {
  background: #2a3848;
  color: #ff69b4;
  transform: scale(1.05);
}
.admin-badge {
  max-width: 600px;
  margin: 0 auto 1rem;
  padding: 0.8rem;
  background: #2a1f2a;
  border: 2px solid #ff69b4;
  border-radius: 12px;
  color: #ff69b4;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.exit-admin {
  padding: 0.3rem 1rem;
  background: #1f2a36;
  color: #ff9b8c;
  border: 1px solid #5c3a48;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.exit-admin:hover {
  background: #2a3848;
  transform: scale(1.05);
}
.password-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}
.password-dialog {
  background: linear-gradient(145deg, #1f2a36, #0f1a22);
  border: 2px solid #ff69b4;
  border-radius: 24px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
}
.password-dialog h3 {
  color: #ff69b4;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}
.password-dialog input {
  width: 100%;
  padding: 1rem;
  background: #1b232e;
  border: 2px solid #31465c;
  border-radius: 12px;
  color: #e1e7ef;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}
.password-dialog input:focus {
  outline: none;
  border-color: #ff69b4;
}
.dialog-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.dialog-buttons button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dialog-buttons button:first-child {
  background: #1f2a36;
  color: #8f9eff;
  border: 1px solid #31465c;
}
.dialog-buttons .confirm-btn {
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: white;
}
.dialog-buttons button:hover {
  transform: scale(1.05);
}
.password-error {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
}
.messages-container {
  max-width: 600px;
  margin: 0 auto 2rem;
}
.no-messages {
  text-align: center;
  padding: 3rem;
  background: rgba(0,0,0,0.3);
  border-radius: 24px;
  color: #8f9eff;
  font-size: 1.2rem;
}
.message-card {
  background: rgba(20, 25, 35, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid #31465c;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.message-author {
  color: #ff69b4;
  font-weight: bold;
}
.message-date {
  color: #8f9eff;
}
.delete-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: all 0.2s ease;
}
.delete-btn:hover {
  transform: scale(1.2);
  color: #ff0000;
}
.message-content {
  color: #e1e7ef;
  line-height: 1.5;
}
.message-input-section {
  max-width: 600px;
  margin: 0 auto 2rem;
}
.message-warning {
  background: rgba(255, 105, 180, 0.1);
  border-left: 4px solid #ff69b4;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #ffb6c1;
}
.signature-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1b232e;
  border: 1px solid #31465c;
  border-radius: 24px;
  transition: 0.3s;
}
.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 2px;
  background-color: #8f9eff;
  border-radius: 50%;
  transition: 0.3s;
}
input:checked + .toggle-slider {
  background-color: #ff69b4;
  border-color: #ff69b4;
}
input:checked + .toggle-slider:before {
  transform: translateX(26px);
  background-color: white;
}
.toggle-label {
  color: #e1e7ef;
}
.signature-input {
  margin-bottom: 1rem;
}
.signature-input input {
  width: 100%;
  padding: 0.8rem;
  background: #1b232e;
  border: 2px solid #31465c;
  border-radius: 12px;
  color: #e1e7ef;
}
.signature-input input:focus {
  outline: none;
  border-color: #ff69b4;
}
.message-input-row {
  display: flex;
  gap: 1rem;
}
.message-input-row input {
  flex: 1;
  padding: 1rem;
  background: #1b232e;
  border: 2px solid #31465c;
  border-radius: 12px;
  color: #e1e7ef;
  font-size: 1rem;
}
.message-input-row input:focus {
  outline: none;
  border-color: #ff69b4;
}
.message-input-row input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.message-input-row button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
.message-input-row button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
}
.message-input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.return-button {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a2f4a;
  color: #6ab0ff;
  border: 1px solid #3a6a9a;
  transition: all 0.3s ease;
}
.return-button:hover {
  background: #2a4a6a;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(106, 176, 255, 0.3);
}
.button-icon {
  font-size: 1.2rem;
}
@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
  .message-input-row {
    flex-direction: column;
  }
}
</style>