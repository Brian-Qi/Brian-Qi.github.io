import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载 - 提升首屏性能
const ComingSoon = () => import('../components/ComingSoon.vue')
const WhoIAm = () => import('../components/WhoIAm.vue')
const Achievement01 = () => import('../components/Achievement_01.vue')
const Achievement02 = () => import('../components/Achievement_02.vue')
const Achievement03 = () => import('../components/Achievement_03.vue')
const Achievement04 = () => import('../components/Achievement_04.vue')
const Achievement05 = () => import('../components/Achievement_05.vue')
const Achievement06 = () => import('../components/Achievement_06.vue')
const AchievementsStats = () => import('../components/AchievementsStats.vue')
const HiddenAchievement01 = () => import('../components/HiddenAchievement_01.vue')
const SecretRoom = () => import('../components/SecretRoom.vue')
const SecretQuiz = () => import('../components/SecretQuiz.vue')
const Guestbook = () => import('../components/Guestbook.vue')
const DailyFortune = () => import('../components/DailyFortune.vue')
const RunGameSelector = () => import('../components/RunGameSelector.vue')
const TheLostRealm = () => import('../components/RunGame_TheLostRealm.vue')
const AchievementUnlock = () => import('../components/Achievement_07.vue')

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
  {
    path: '/who_i_am/achievement_curious',
    name: 'Achievement07',
    component: AchievementUnlock
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



// 检查是否有重定向路径


export default router