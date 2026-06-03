import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载 - 提升首屏性能
const Index = () => import('../components/Index.vue')
const NewIndex = () => import('../components/NewIndex.vue')
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
const HiddenAchievement02 = () => import('../components/HiddenAchievement_02.vue')
const SecretRoom = () => import('../components/SecretRoom.vue')
const SecretQuiz = () => import('../components/SecretQuiz.vue')
const Guestbook = () => import('../components/Guestbook.vue')
const DailyFortune = () => import('../components/DailyFortune.vue')
const RunGameSelector = () => import('../components/RunGameSelector.vue')
const TheLostRealm = () => import('../components/RunGame_TheLostRealm.vue')
const AchievementUnlock = () => import('../components/Achievement_07.vue')
const Achievement08 = () => import('../components/Achievement_08.vue')
// CompanyInfo 已整合到 NewIndex 弹窗，不再作为独立页面
// const CompanyInfo = () => import('../components/CompanyInfo.vue')
// const PoolGame = () => import('../components/PoolGame.vue')

const routes = [
  {
    path: '/',
    name: 'comingSoon',
    component: ComingSoon
  },
  {
    path: '/index',
    name: 'index',
    component: NewIndex
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
    path: '/who_i_am/hidden_achievement_music',
    name: 'HiddenAchievement02',
    component: HiddenAchievement02
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
  {
    path: '/who_i_am/achievement_theme_flipper',
    name: 'Achievement08',
    component: Achievement08
  },
  // 公司信息已整合到首页弹窗
  // {
  //   path: '/company',
  //   name: 'CompanyInfo',
  //   component: CompanyInfo
  // },
  // {
  //   path: '/who_i_am/pool_game',
  //   name: 'PoolGame',
  //   component: PoolGame
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



// 检查是否有重定向路径


export default router