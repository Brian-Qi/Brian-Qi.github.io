<template>
  <div class="secret-quiz">
    <div class="quiz-container">
      <h1>🔐 验证身份 🔐</h1>
      <div class="score-display">当前得分：{{ totalScore }}/10</div>
      <!-- 单选题 -->
      <div v-if="questions[currentQuestionIndex].type === 'single'" class="question-section">
        <h2>{{ questions[currentQuestionIndex].text }}</h2>
        <div class="options">
          <div 
            v-for="(option, idx) in questions[currentQuestionIndex].options" 
            :key="idx"
            class="option"
            :class="{ selected: singleAnswer === idx }"
            @click="singleAnswer = idx"
          >
            {{ option }}
          </div>
        </div>
      </div>
      <!-- 多选题（普通） -->
      <div v-else-if="questions[currentQuestionIndex].type === 'multiple' && !questions[currentQuestionIndex].unlockCondition" class="question-section">
        <h2>{{ questions[currentQuestionIndex].text }}</h2>
        <p> 多选 </p>
        <div class="options">
          <div 
            v-for="(option, idx) in questions[currentQuestionIndex].options" 
            :key="idx"
            class="option"
            :class="{ selected: multipleAnswers.includes(idx) }"
            @click="toggleMultiple(idx)"
          >
            {{ option }}
          </div>
        </div>
      </div>
      <!-- 隐藏多选题 -->
      <div v-else-if="questions[currentQuestionIndex].type === 'multiple' && questions[currentQuestionIndex].unlockCondition" class="question-section">
        <div v-if="allPreviousCorrect" class="hidden-question">
          <h2>{{ questions[currentQuestionIndex].text }}</h2>
          <p class="warning">⚠️ 选错就前功尽弃咯~ ⚠️</p>
          <div class="options">
            <div 
              v-for="(option, idx) in questions[currentQuestionIndex].options" 
              :key="idx"
              class="option"
              :class="{ selected: multipleAnswers.includes(idx) }"
              @click="toggleMultiple(idx)"
            >
              {{ option }}
            </div>
          </div>
        </div>
        <div v-else class="locked-question">
          <h2>🔒 题目已锁定</h2>
          <p>前面有题目答错了，无法解锁本题</p>
        </div>
      </div>
      <!-- 填空题 -->
      <div v-else-if="showFillQuestion" class="question-section">
        <h2>{{ questions[currentQuestionIndex].text }}</h2>
        <div class="password-input">
          <input 
            v-model="fillAnswer"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="questions[currentQuestionIndex].placeholder || '输入答案'"
            @keyup.enter="submitAnswer"
          >
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
      </div>
      <!-- 提交按钮 -->
      <div class="action-area">
        <button @click="submitAnswer" :disabled="!canSubmit">提交</button>
      </div>
    </div>
    <!-- 跳过答题按钮 -->
    <div v-if="hasVisitedSecretRoom" class="skip-button" @click="skipToSecretRoom">
      <span>🚪 直接进入秘密空间</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SecretQuiz',
  setup() {
    const router = useRouter()
    const showPassword = ref(false)
    const currentQuestionIndex = ref(0)
    const singleAnswer = ref(null)
    const multipleAnswers = ref([])
    const fillAnswer = ref('')
    const totalScore = ref(0)
    const showFillQuestion = ref(false)
    const allPreviousCorrect = ref(true)
    const hasVisitedSecretRoom = ref(false)

    const questions = [
      {
        type: 'single',
        text: '作者的性别:',
        options: ['男', '女', '其他', '未知'],
        correct: 0
      },
      {
        type: 'single',
        text: '作者玩的最多的游戏的开发商？',
        options: ['米哈游', '库洛', '鹰角', '作者自己(不会真有人选这个吧)'],
        correct: 3 
      },
      {
        type: 'multiple',
        text: '作者高中都干过？',
        options: ['coser扫楼(我天这是高中)','顺个火柴棒(一人高的火柴见过吗)','达摩小图标(是那个光头吗？)','不知道，我的身材很曼妙(不管是谁，你确实很曼妙)'],
        correct: [0,2]
      },//在此鸣谢  与夏卿 达摩(?)
      {
        type: 'multiple',
        text: '作者爱喝的小饮料？',
        options: ['茶水(养生呢)', '气泡小甜水(爽的嘞)', '奶茶(好喝爱喝天天喝)', '风油精(不是哥们诗人啊)'],
        correct: [0,3]
      },//在此鸣谢  神级的欧胖
      {
        type: 'multiple',
        text: '作者的外号？',
        options: ['骚furry','奇骚','神秘代码男','骚哥'],
        correct: [1,3] 
      },//在此鸣谢  Leeronly
      {
        type: 'multiple',
        text: '关于以下关于作者正确的：',
        options: ['香香软软小蛋糕','编程用微软大战代码','觉得mcm是好老师','原神nb'],
        correct: [1,3],
        failOnWrong: true,
        scored: false,
        unlockCondition: true
      },//在此鸣谢(并非鸣谢)  麻将有麻没酱
      {
        type: 'fill',
        text: '输入作者给你的密钥',
        correct: '852573131',
        placeholder: '输入密钥'
      }
    ]

    const canSubmit = computed(() => {
      const q = questions[currentQuestionIndex.value]
      if (!q) return false
      if (q.type === 'single') return singleAnswer.value !== null
      if (q.type === 'multiple') {
        if (q.unlockCondition && !allPreviousCorrect.value) return false
        return multipleAnswers.value.length > 0
      }
      if (q.type === 'fill' && showFillQuestion.value) return fillAnswer.value.trim() !== ''
      return false
    })

    const toggleMultiple = (idx) => {
      if (multipleAnswers.value.includes(idx)) {
        multipleAnswers.value = multipleAnswers.value.filter(i => i !== idx)
      } else {
        multipleAnswers.value.push(idx)
      }
    }

    const calculateMultipleScore = (selected, correct) => {
      if (selected.length >= 3) return 0
      let correctCount = 0
      selected.forEach(ans => {
        if (correct.includes(ans)) correctCount++
      })
      return correctCount
    }

    const checkAllChoiceDone = () => {
      if (!allPreviousCorrect.value) {
        return currentQuestionIndex.value >= 5
      }
      return currentQuestionIndex.value >= 6
    }

    const submitAnswer = () => {
      if (!canSubmit.value) return
      const q = questions[currentQuestionIndex.value]
      if (q.type === 'single') {
        if (singleAnswer.value === q.correct) {
          totalScore.value += 2
        } else {
          allPreviousCorrect.value = false
        }
        if (currentQuestionIndex.value < questions.length - 1) {
          currentQuestionIndex.value++
          singleAnswer.value = null
        }
      } else if (q.type === 'multiple') {
        if (q.unlockCondition && !allPreviousCorrect.value) {
          return
        }
        if (q.failOnWrong) {
          let hasWrong = false
          multipleAnswers.value.forEach(ans => {
            if (!q.correct.includes(ans)) {
              hasWrong = true
            }
          })
          if (hasWrong) {
            router.push('/')
            return
          }
        }
        if (q.scored !== false) {
          const score = calculateMultipleScore(multipleAnswers.value, q.correct)
          totalScore.value += score
        }
        const selected = multipleAnswers.value
        const correct = q.correct
        let isCorrect = true
        if (selected.length !== correct.length) {
          isCorrect = false
        } else {
          isCorrect = correct.every(ans => selected.includes(ans))
        }
        if (!isCorrect) {
          allPreviousCorrect.value = false
        } else {
          if (q.unlockCondition && isCorrect) {
            localStorage.setItem('achieve_04', 'true')
            router.push('/who_i_am/secret_quiz/achieve_true_bro')
            return
          }
        }
        if (currentQuestionIndex.value < questions.length - 1) {
          currentQuestionIndex.value++
          multipleAnswers.value = []
        }
      } else if (q.type === 'fill') {
        const isFillCorrect = (fillAnswer.value.trim().toLowerCase() === q.correct.toLowerCase())
        if (isFillCorrect || totalScore.value >= 8) {
          router.push('/who_i_am/secret_quiz/secret_room')
        } else {
          router.push('/')
        }
        return
      }
      if (checkAllChoiceDone()) {
        if (totalScore.value >= 8) {
          router.push('/who_i_am/secret_quiz/secret_room')
        } else {
          showFillQuestion.value = true
          currentQuestionIndex.value = 6
        }
      }
    }

    const skipToSecretRoom = () => {
      router.push('/who_i_am/secret_quiz/secret_room')
    }

    onMounted(() => {
      const visited = localStorage.getItem('hasVisitedSecretRoom')
      hasVisitedSecretRoom.value = visited === 'true'
    })

    return {
      currentQuestionIndex,
      questions,
      singleAnswer,
      multipleAnswers,
      fillAnswer,
      totalScore,
      showFillQuestion,
      allPreviousCorrect,
      canSubmit,
      toggleMultiple,
      submitAnswer,
      showPassword,
      hasVisitedSecretRoom,
      skipToSecretRoom
    }
  }
}
</script>

<style scoped>
.secret-quiz {
  min-height: 100vh;
  background: linear-gradient(145deg, #1a1f2a, #2a1f2a);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  position: relative;
}
.quiz-container {
  max-width: 600px;
  width: 100%;
  background: rgba(20, 25, 35, 0.9);
  backdrop-filter: blur(12px);
  border: 2px solid #ff69b4;
  border-radius: 32px;
  padding: 3rem 2rem;
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
}
h1 {
  font-size: 2.5rem;
  color: #ff69b4;
  text-align: center;
  margin-bottom: 1rem;
}
.score-display {
  text-align: center;
  font-size: 1.5rem;
  color: #42b983;
  margin-bottom: 2rem;
  font-weight: bold;
}
.question-section {
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.3rem;
  color: #e1e7ef;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
.warning {
  color: #ff6b6b;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
.locked-question {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
}
.locked-question h2 {
  color: #8f9eff;
  margin-bottom: 1rem;
}
.locked-question p {
  color: #506277;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.option {
  padding: 1rem;
  background: #1b232e;
  border: 2px solid #31465c;
  border-radius: 12px;
  color: #e1e7ef;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}
.option:hover {
  border-color: #ff69b4;
  transform: translateX(5px);
}
.password-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.password-input input {
  flex: 1;
}
.toggle-password {
  padding: 1rem;
  background: #1b232e;
  border: 2px solid #31465c;
  border-radius: 12px;
  color: #e1e7ef;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}
.toggle-password:hover {
  border-color: #ff69b4;
  transform: scale(1.05);
}
.option.selected {
  border-color: #42b983;
  background: #1f2f3a;
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.3);
}
input {
  width: 100%;
  padding: 1rem;
  background: #1b232e;
  border: 2px solid #31465c;
  border-radius: 12px;
  color: #e1e7ef;
  font-size: 1rem;
  transition: all 0.2s ease;
}
input:focus {
  outline: none;
  border-color: #ff69b4;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
}
.action-area {
  margin-top: 2rem;
  text-align: center;
}
button {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
}
button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.6);
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}
.skip-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff69b4, #8a6de9);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 40px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
  transition: all 0.3s ease;
  z-index: 100;
}
.skip-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.8);
}
@media (max-width: 600px) {
  .quiz-container {
    padding: 2rem 1rem;
  }
  h1 {
    font-size: 2rem;
  }
  .score-display {
    font-size: 1.2rem;
  }
  h2 {
    font-size: 1.1rem;
  }
  .option {
    padding: 0.8rem;
  }
  .skip-button {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    bottom: 10px;
    right: 10px;
  }
}
</style>