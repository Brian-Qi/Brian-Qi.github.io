import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载 - 提升首屏性能
const Home = () => import('../components/Home.vue')
const ComingSoon = () => import('../components/ComingSoon.vue')
const WhoIAm = () => import('../components/WhoIAm.vue')
const Achievement01 = () => import('../components/Achievement_01.vue')
const Achievement02 = () => import('../components/Achievement_02.vue')
const Achievement03 = () => import('../components/Achievement_03.vue')
const Achievement05 = () => import('../components/Achievement_05.vue')
const Achievement06 = () => import('../components/Achievement_06.vue')
const AchievementsStats = () => import('../components/AchievementsStats.vue')
const HiddenAchievement01 = () => import('../components/HiddenAchievement_01.vue')
const Moyu = () => import('../components/Moyu.vue')
const Guestbook = () => import('../components/Guestbook.vue')
const DailyFortune = () => import('../components/DailyFortune.vue')
const RunGameSelector = () => import('../components/RunGameSelector.vue')
const TheLostRealm = () => import('../components/RunGame_TheLostRealm.vue')
const AchievementUnlock = () => import('../components/Achievement_07.vue')
const Achievement08 = () => import('../components/Achievement_08.vue')

const routes = [
  {
    path: '/',
    name: 'comingSoon',
    component: ComingSoon
  },
  {
    path: '/index',
    name: 'index',
    component: Home
  },
  {
    path: '/index_01',
    redirect: '/index'
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
    path: '/moyu',
    name: 'Moyu',
    component: Moyu
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
    path: '/moyu/run_game',
    name: 'RunGameSelector',
    component: RunGameSelector
  },
  {
    path: '/moyu/run_game/the_lost_realm',
    name: 'TheLostRealm',
    component: TheLostRealm
  },
  // 旧「秘密空间」路径重定向到摸鱼区
  { path: '/who_i_am/secret_quiz', redirect: '/moyu' },
  { path: '/who_i_am/secret_quiz/secret_room', redirect: '/moyu' },
  { path: '/who_i_am/secret_quiz/secret_room/run_game', redirect: '/moyu/run_game' },
  { path: '/who_i_am/secret_quiz/secret_room/run_game/the_lost_realm', redirect: '/moyu/run_game/the_lost_realm' },
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
  // 兜底 404：必须放在最后。此前缺少该路由，未知地址会回退到 index.html 后白屏
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 检查是否有重定向路径

export default router
