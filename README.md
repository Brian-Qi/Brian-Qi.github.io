# Briandolph Qi 的个人网站

> 一个充满彩蛋与成就的个人网站，集成了留言墙、每日运势、隐藏成就等互动功能。

## ✨ 在线预览
[https://briandolph.xyz](https:////briandolph.xyz)

## 🛠️ 技术栈
- **前端框架**：Vue 3
- **路由管理**：Vue Router
- **数据存储**：Supabase（留言墙）
- **部署平台**：GitHub Pages
- **样式方案**：SCSS + 自定义 CSS

## 📁 项目结构
```
briandolph_test/
├── public/
│   ├── brian_logo.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ComingSoon.vue
│   │   ├── WhoIAm.vue
│   │   ├── AchievementsStats.vue
│   │   ├── DailyFortune.vue
│   │   ├── SecretQuiz.vue
│   │   ├── SecretRoom.vue
│   │   ├── Guestbook.vue
│   │   ├── Achievement_01.vue
│   │   ├── Achievement_02.vue
│   │   ├── Achievement_03.vue
│   │   ├── Achievement_04.vue
│   │   ├── Achievement_05.vue
│   │   ├── Achievement_06.vue
│   │   └── HiddenAchievement_01.vue
│   ├── utils/
│   │   └── supabase.js
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── .gitignore
├── package.json
├── vue.config.js
└── README.md
```

## 🎮 功能列表

### 🏠 首页
- 施工精灵动态语录
- 页面装修进度条（随机 30-70%）
- 闪烁小圆点动画

### 👤 关于页面
- 自我介绍 + 能力图鉴
- 彩蛋区：
  - 点击次数成就（50次解锁"闲的蛋疼"，60次解锁"捣蛋专家"）
  - 秘密按钮（20次进入答题页面）
  - 今日运势入口

### 🏆 成就系统
**6个普通成就：**
| 成就 | 解锁条件 | 边框颜色 |
|------|----------|----------|
| 闲的蛋疼 | 关于页面点击按钮50次 | 紫色 |
| 捣蛋专家 | 闲的蛋疼页面点击60次 | 金色 |
| 摸鱼精灵 | 首页进度<40且代码行<40时点击施工精灵 | 绿色 |
| 最佳损友 | 答对所有题目 | 蓝色 |
| 鸿运当头 | 首次抽到大吉 | 金色 |
| 逢凶化吉 | 首次抽到大凶 | 红金色 |

**1个隐藏成就：**
- **天命所归**：集齐7种运势，解锁后显示炫彩边框

**成就图鉴特色：**
- 粒子特效（成就越多粒子越多）
- 未解锁成就显示故障乱码效果
- 一键重置所有成就

### 🔮 每日运势
- 7种运势（大吉、吉、小吉、平、小凶、凶、大凶）
- 每日固定运势
- 集齐7种运势解锁隐藏成就

### 📝 留言墙
- 署名开关
- 管理员密码验证
- 云端存储（Supabase）
- 跨设备同步
