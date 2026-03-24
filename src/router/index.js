import { createRouter, createWebHistory } from 'vue-router'
import ComingSoon from '../components/ComingSoon.vue'
import WhoIAm from '../components/WhoIAm.vue'
import Achievement01 from '../components/Achievement_01.vue'
import Achievement02 from '../components/Achievement_02.vue'
import Achievement03 from '../components/Achievement_03.vue'
import Achievement04 from '../components/Achievement_04.vue'
import Achievement05 from '../components/Achievement_05.vue'
import Achievement06 from '../components/Achievement_06.vue'
import AchievementsStats from '../components/AchievementsStats.vue'
import HiddenAchievement01 from '../components/HiddenAchievement_01.vue'
import SecretRoom from '../components/SecretRoom.vue'
import SecretQuiz from '../components/SecretQuiz.vue'
import Guestbook from '../components/Guestbook.vue'
import DailyFortune from '../components/DailyFortune.vue'
import RunGameSelector from '../components/RunGameSelector.vue'
import TheLostRealm from '../components/RunGame_TheLostRealm.vue'

const routes = [
  {
    path: '/',
    name: 'comingSoon',
    component: ComingSoon
  },
  {
    path: '/who_i_am',
    name: 'WhoIAm',
    component: WhoIAm
  },
  {
    path: '/who_i_am/achieve_idle',
    name: 'AchievementIdle',
    component: Achievement01
  },
  {
    path: '/who_i_am/achieve_idle/achieve_super_idle',
    name: 'Achievement02',
    component: Achievement02
  },
  {
    path: '/achieve_slacking',
    name: 'Achievement03',
    component: Achievement03
  },
  {
    path: '/achievements',
    name: 'AchievementsStats',
    component: AchievementsStats
  },
  {
    path: '/who_i_am/secret_quiz/secret_room',
    name: 'SecretRoom',
    component: SecretRoom
  },
  {
    path: '/who_i_am/secret_quiz',
    name: 'SecretQuiz',
    component: SecretQuiz
  },
  {
    path: '/who_i_am/secret_quiz/achieve_true_bro',
    name: 'Achievement04',
    component: Achievement04
  },
  {
    path: '/guestbook',
    name: 'Guestbook',
    component: Guestbook
  },
  {
    path: '/who_i_am/fortune',
    name: 'DailyFortune',
    component: DailyFortune
  },
  {
    path: '/who_i_am/fortune/achieve_lucky_strike',
    name: 'Achievement05',
    component: Achievement05
  },
  {
    path: '/who_i_am/fortune/achieve_turn_the_tide',
    name: 'Achievement06',
    component: Achievement06
  },
  {
    path: '/who_i_am/fortune/achieve_fate_blessed',
    name: 'HiddenAchievement01',
    component: HiddenAchievement01
  },
  {
    path: '/who_i_am/secret_quiz/secret_room/run_game',
    name: 'RunGameSelector',
    component: RunGameSelector
  },
  {
    path: '/who_i_am/secret_quiz/secret_room/run_game/the_lost_realm',
    name: 'TheLostRealm',
    component: TheLostRealm
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



// 检查是否有重定向路径
const redirectPath = sessionStorage.getItem('redirect')
if (redirectPath) {
  // 清除存储的路径
  sessionStorage.removeItem('redirect')
  // 跳转到保存的路径
  router.replace(redirectPath)
}

export default router