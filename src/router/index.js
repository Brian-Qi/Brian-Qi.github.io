import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载 - 提升首屏性能
// —— 入口 ——
const ComingSoon = () => import('../components/ComingSoon.vue')

// —— 公司展示站（/index/*）——
const CompanyLayout = () => import('../components/company/CompanyLayout.vue')
const CompanyHome = () => import('../components/company/CompanyHome.vue')
const CompanyAbout = () => import('../components/company/CompanyAbout.vue')
const CompanyServices = () => import('../components/company/CompanyServices.vue')
const CompanyWorks = () => import('../components/company/CompanyWorks.vue')
const CompanyContact = () => import('../components/company/CompanyContact.vue')

// —— 个人站（/self/*）——
const Home = () => import('../components/Home.vue')
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
const NotFound = () => import('../components/NotFound.vue')

const routes = [
  /* ===================== 入口过渡页 ===================== */
  { path: '/', name: 'comingSoon', component: ComingSoon, meta: { title: 'Briandolph Qi · 施工中' } },
  { path: '/index_01', redirect: '/index' },

  /* ===================== 公司展示站 ===================== */
  {
    path: '/index',
    component: CompanyLayout,
    meta: { company: true },
    children: [
      { path: '', name: 'index', component: CompanyHome, meta: { company: true, title: '彼岸时墟游戏工作室' } },
      { path: 'about', name: 'company-about', component: CompanyAbout, meta: { company: true, title: '关于我们 · 彼岸时墟' } },
      { path: 'services', name: 'company-services', component: CompanyServices, meta: { company: true, title: '业务范围 · 彼岸时墟' } },
      { path: 'works', name: 'company-works', component: CompanyWorks, meta: { company: true, title: '作品案例 · 彼岸时墟' } },
      { path: 'contact', name: 'company-contact', component: CompanyContact, meta: { company: true, title: '联系我们 · 彼岸时墟' } }
    ]
  },

  /* ===================== 个人站（/self/*） ===================== */
  { path: '/self', name: 'self-home', component: Home, meta: { title: 'Briandolph Qi' } },
  { path: '/self/who_i_am', name: 'WhoIAm', component: WhoIAm, meta: { title: '关于我 · Briandolph Qi' } },
  { path: '/self/who_i_am/achieve_idle', name: 'AchievementIdle', component: Achievement01, meta: { title: '成就解锁 · Briandolph Qi' } },
  {
    path: '/self/who_i_am/achieve_idle/achieve_super_idle',
    name: 'Achievement02',
    component: Achievement02,
    meta: { title: '超级摸鱼 · Briandolph Qi' }
  },
  { path: '/self/achieve_slacking', name: 'Achievement03', component: Achievement03, meta: { title: '摸鱼精灵 · Briandolph Qi' } },
  { path: '/self/achievements', name: 'AchievementsStats', component: AchievementsStats, meta: { title: '成就图鉴 · Briandolph Qi' } },
  { path: '/self/moyu', name: 'Moyu', component: Moyu, meta: { title: '摸鱼区 · Briandolph Qi' } },
  { path: '/self/guestbook', name: 'Guestbook', component: Guestbook, meta: { title: '留言墙 · Briandolph Qi' } },
  { path: '/self/who_i_am/fortune', name: 'DailyFortune', component: DailyFortune, meta: { title: '今日运势 · Briandolph Qi' } },
  {
    path: '/self/who_i_am/fortune/achieve_lucky_strike',
    name: 'Achievement05',
    component: Achievement05,
    meta: { title: '成就解锁 · Briandolph Qi' }
  },
  {
    path: '/self/who_i_am/fortune/achieve_turn_the_tide',
    name: 'Achievement06',
    component: Achievement06,
    meta: { title: '成就解锁 · Briandolph Qi' }
  },
  {
    path: '/self/who_i_am/fortune/achieve_fate_blessed',
    name: 'HiddenAchievement01',
    component: HiddenAchievement01,
    meta: { title: '隐藏成就 · Briandolph Qi' }
  },
  { path: '/self/moyu/run_game', name: 'RunGameSelector', component: RunGameSelector, meta: { title: '单人跑团 · Briandolph Qi' } },
  {
    path: '/self/moyu/run_game/the_lost_realm',
    name: 'TheLostRealm',
    component: TheLostRealm,
    meta: { title: '遗落之境 · Briandolph Qi' }
  },
  {
    path: '/self/who_i_am/achievement_curious',
    name: 'Achievement07',
    component: AchievementUnlock,
    meta: { title: '成就解锁 · Briandolph Qi' }
  },
  {
    path: '/self/who_i_am/achievement_theme_flipper',
    name: 'Achievement08',
    component: Achievement08,
    meta: { title: '成就解锁 · Briandolph Qi' }
  },

  /* ============ 旧个人路径 → /self 迁移重定向（保持老链接可用） ============ */
  // 旧「秘密空间」路径（更具体的放前面）
  { path: '/who_i_am/secret_quiz/secret_room/run_game/the_lost_realm', redirect: '/self/moyu/run_game/the_lost_realm' },
  { path: '/who_i_am/secret_quiz/secret_room/run_game', redirect: '/self/moyu/run_game' },
  { path: '/who_i_am/secret_quiz/secret_room', redirect: '/self/moyu' },
  { path: '/who_i_am/secret_quiz', redirect: '/self/moyu' },
  // 其余旧个人路径整体前移 /self
  { path: '/who_i_am/:pathMatch(.*)*', redirect: (to) => '/self' + to.path },
  { path: '/moyu/:pathMatch(.*)*', redirect: (to) => '/self' + to.path },
  { path: '/guestbook', redirect: '/self/guestbook' },
  { path: '/achievements', redirect: '/self/achievements' },
  { path: '/achieve_slacking', redirect: '/self/achieve_slacking' },

  /* ===================== 404 ===================== */
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '页面不存在 · Briandolph Qi' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// 按 meta.title 设置页面标题
router.afterEach((to) => {
  if (to.meta && to.meta.title) document.title = to.meta.title
})

export default router
