<template>
  <div class="lyric-bar">
    <Transition name="lyric" mode="out-in">
      <div class="lyric-content" :key="currentGroup.idx">
        <div class="lyric-en">{{ currentGroup.en }}</div>
        <div class="lyric-cn">— {{ currentGroup.cn }} —</div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, inject, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'LyricBar',
  setup() {
    const musicAudio = inject('musicAudio', ref(null))
    const lyrics = ref([])
    const currentTime = ref(0)
    let intervalId = null

    async function loadLyric() {
      try {
        const res = await fetch('/music/da-capo.lrc')
        const text = await res.text()
        const lines = text.split('\n').filter(l => l.trim())
        const parsed = []
        let current = null

        for (const line of lines) {
          const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/)
          if (!match) continue
          const mins = parseInt(match[1])
          const secs = parseInt(match[2])
          const ms = parseInt(match[3].padEnd(3, '0'))
          const time = mins * 60 + secs + ms / 1000
          const text = match[4].trim()
          if (!text || text.startsWith('作词') || text.startsWith('作曲') || text.startsWith('编曲') || text.startsWith('制作人')) continue

          if (current && Math.abs(current.time - time) < 0.01) {
            current.cn = text
          } else {
            if (current) parsed.push(current)
            current = {
              time,
              en: /[\u4e00-\u9fa5]/.test(text) ? '' : text,
              cn: /[\u4e00-\u9fa5]/.test(text) ? text : ''
            }
          }
        }
        if (current) parsed.push(current)
        lyrics.value = parsed
      } catch (e) {
        // 歌词加载失败，静默处理
      }
    }

    onMounted(() => {
      loadLyric()
      intervalId = setInterval(() => {
        if (musicAudio.value && !musicAudio.value.paused) {
          currentTime.value = musicAudio.value.currentTime
        }
      }, 100)
    })

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId)
    })

    const currentGroup = computed(() => {
      let idx = -1
      for (let i = lyrics.value.length - 1; i >= 0; i--) {
        if (currentTime.value >= lyrics.value[i].time) {
          idx = i
          break
        }
      }
      if (idx < 0) return { en: '', cn: '', idx: -1 }
      return { ...lyrics.value[idx], idx }
    })

    return { currentGroup }
  }
}
</script>

<style scoped>
.lyric-bar {
  position: fixed;
  bottom: 46px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  z-index: 100;
}

.lyric-content {
  text-align: center;
}

/* 歌词切换动画 */
.lyric-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.lyric-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.lyric-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
.lyric-leave-to {
  opacity: 0;
  transform: scale(1.15);
}

.lyric-en {
  margin: 0 0 8px;
  font-size: 60px;
  color: #b39ddb;
  font-family: 'Great Vibes', cursive;
  line-height: 1.4;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.lyric-cn {
  margin: 0;
  font-size: 24px;
  color: #7ec8e3;
  font-family: 'LXGW WenKai', cursive;
  line-height: 1.4;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}
</style>
