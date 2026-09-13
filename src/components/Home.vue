<template>
  <div class="c-page">
    <div class="c-card">
      <div class="c-avatar"><img :src="avatar" alt="Briandolph Qi" /></div>

      <h1 class="c-name">Briandolph Qi</h1>
      <p class="c-role"><span class="c-dot"></span>Developer · 彼岸时墟游戏工作室</p>

      <div class="c-rule"></div>

      <p class="c-bio" @click="toggleBio">{{ bioLines.join('') }}</p>

      <nav class="c-links">
        <template v-for="(link, i) in socialLinks" :key="link.name">
          <a
            class="c-link"
            :href="link.url"
            :target="link.url.startsWith('http') ? '_blank' : undefined"
            :rel="link.url.startsWith('http') ? 'noopener' : undefined"
            @click="onSocial(link, $event)"
          >{{ link.name }}</a>
          <span v-if="i < socialLinks.length - 1" class="c-sep">·</span>
        </template>
      </nav>

      <div class="c-rule"></div>

      <div class="c-meta">
        <span class="c-time">{{ now.hour }}:{{ now.minute }}:{{ now.second }} · {{ now.weekday }}</span>
        <span class="c-quote" @click="fetchHitokoto">{{ hitokoto.text }}</span>
      </div>
    </div>

    <footer class="c-foot">
      <span>Copyright © {{ now.year }} Briandolph Qi</span>
      <RouterLink class="c-back" to="/">↩ 回到 ComingSoon</RouterLink>
    </footer>

    <Transition name="c-fade">
      <div v-if="showCompany" class="c-mask" @click.self="showCompany = false">
        <CompanyInfo @close="showCompany = false" />
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import hitokotoData from '@/data/hitokoto.json'
import CompanyInfo from './CompanyInfo.vue'
import avatar from '@/assets/avatar.webp'

const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const ZH = '一个热爱编程、喜欢捣鼓各种新奇技术的开发者。白天修复 Bug，夜晚创造 Bug，在 Ctrl+C 和 Ctrl+V 之间寻找代码的真谛。'
const EN = 'Hello there! Welcome to my digital garden — feel free to look around, there might be Easter eggs hiding somewhere.'

export default {
  name: 'HomePage',
  components: { CompanyInfo },
  setup() {
    const router = useRouter()

    const now = reactive({ year: '', month: '', day: '', weekday: '', hour: '', minute: '', second: '' })
    let timer = null
    function tick() {
      const d = new Date()
      now.year = d.getFullYear()
      now.month = String(d.getMonth() + 1).padStart(2, '0')
      now.day = String(d.getDate()).padStart(2, '0')
      now.weekday = WEEK[d.getDay()]
      now.hour = String(d.getHours()).padStart(2, '0')
      now.minute = String(d.getMinutes()).padStart(2, '0')
      now.second = String(d.getSeconds()).padStart(2, '0')
    }

    const bioEn = ref(false)
    const bioLines = ref([ZH])
    function toggleBio() {
      bioEn.value = !bioEn.value
      bioLines.value = [bioEn.value ? EN : ZH]
    }

    const hitokoto = reactive({ text: '这里应该显示一句话' })
    function fetchHitokoto() {
      if (!hitokotoData.length) return
      hitokoto.text = hitokotoData[Math.floor(Math.random() * hitokotoData.length)].text
    }

    const showCompany = ref(false)
    const socialLinks = [
      { name: 'GitHub', url: 'https://github.com/Brian-Qi' },
      { name: 'Email', url: 'mailto:qisihao666@163.com' },
      { name: '工作室', url: '/company' },
      { name: '留言墙', url: '/guestbook' },
      { name: '关于我', url: '/who_i_am' }
    ]
    function onSocial(link, e) {
      if (link.name === '工作室') {
        e.preventDefault()
        showCompany.value = true
        return
      }
      if (!link.url.startsWith('http') && !link.url.startsWith('mailto')) {
        e.preventDefault()
        router.push(link.url)
      }
    }

    onMounted(() => {
      tick()
      timer = setInterval(tick, 1000)
      fetchHitokoto()
    })
    onUnmounted(() => clearInterval(timer))

    return { avatar, now, bioLines, toggleBio, hitokoto, fetchHitokoto, showCompany, socialLinks, onSocial }
  }
}
</script>

<style scoped>
.c-page {
  position: relative;
  min-height: calc(100vh - 60px);
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.c-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(60% 50% at 50% 42%, var(--app-accent-glow), transparent 70%);
  opacity: 0.5;
}

.c-card {
  position: relative;
  width: 100%;
  max-width: 560px;
  text-align: center;
}

.c-avatar {
  width: 84px;
  height: 84px;
  margin: 0 auto 1.4rem;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  box-shadow: 0 14px 34px -12px var(--app-accent-glow);
  animation: c-rise 0.7s ease both;
}
.c-avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.c-name {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2.6rem, 7vw, 4.1rem) !important;
  line-height: 1.05 !important;
  color: var(--app-text);
  animation: c-rise 0.7s ease 0.06s both;
}

.c-role {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  color: var(--app-text-secondary);
  animation: c-rise 0.7s ease 0.12s both;
}
.c-dot { width: 6px; height: 6px; border-radius: 50%; background: #42b983; box-shadow: 0 0 8px #42b983; }

.c-rule {
  height: 1px;
  margin: 2rem 0;
  background: linear-gradient(90deg, transparent, var(--app-border), transparent);
}

.c-bio {
  font-family: 'LXGW WenKai', cursive;
  font-size: 1rem;
  line-height: 2;
  color: var(--app-text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}
.c-bio:hover { color: var(--app-text); }

.c-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin-top: 1.7rem;
}
.c-link {
  position: relative;
  font-size: 0.92rem;
  color: var(--app-text);
  padding-bottom: 2px;
  transition: color 0.25s ease;
}
.c-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: var(--app-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.28s ease;
}
.c-link:hover { color: var(--app-accent); }
.c-link:hover::after { transform: scaleX(1); }
.c-sep { color: var(--app-text-muted); }

.c-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  font-size: 0.76rem;
  color: var(--app-text-muted);
}
.c-time { font-family: 'Consolas', 'Menlo', monospace; letter-spacing: 0.04em; white-space: nowrap; }
.c-quote {
  font-family: 'LXGW WenKai', cursive;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.25s ease;
}
.c-quote:hover { color: var(--app-text-secondary); }

.c-foot {
  position: relative;
  margin-top: 2.6rem;
  font-size: 0.75rem;
  color: var(--app-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
}

.c-back {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--app-text-muted);
  opacity: 0.55;
  transition: opacity 0.25s ease, color 0.25s ease;
}
.c-back:hover { opacity: 1; color: var(--app-accent); }

.c-mask {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
}
.c-fade-enter-active, .c-fade-leave-active { transition: opacity 0.25s ease; }
.c-fade-enter-from, .c-fade-leave-to { opacity: 0; }

@keyframes c-rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .c-page { height: auto; min-height: calc(100vh - 52px); }
  .c-meta { flex-direction: column; gap: 0.5rem; }
  .c-quote { white-space: normal; }
}
</style>
