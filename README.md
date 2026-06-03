# Briandolph Qi 的个人网站

> Vue 3 搭建的个人主页，集成了壁纸切换、背景音乐、每日运势、成就系统、隐藏跑酷小游戏等彩蛋功能。

## ✨ 在线预览
[https://briandolph.xyz](https://briandolph.xyz)

## 🛠️ 技术栈
- **前端框架**：Vue 3 + Composition API
- **路由管理**：Vue Router（全路由懒加载）
- **数据存储**：Supabase（留言墙）
- **部署平台**：GitHub Pages
- **样式方案**：SCSS + CSS 自定义属性
- **字体**：LXGW WenKai 霞鹜文楷、Great Vibes、DigifaceWide

## 📁 项目结构
```
briandolph_test/
├── public/
│   ├── fonts/                  # 字体文件
│   │   ├── GreatVibes-Regular.ttf
│   │   └── DigifaceWide-Regular.ttf
│   ├── music/
│   │   └── bg.mp3              # 背景音乐（用户交互后延迟加载）
│   ├── 壁纸.jpg                # 首页壁纸（idle 后加载）
│   ├── 404.html
│   └── index.html
├── src/
│   ├── components/
│   │   ├── NewIndex.vue        # 新首页
│   │   ├── Index.vue           # 旧首页（网易云音乐版）
│   │   ├── ComingSoon.vue      # 入口过渡页
│   │   ├── WhoIAm.vue          # 关于我
│   │   ├── CompanyInfo.vue     # 公司信息弹窗
│   │   ├── LyricBar.vue        # 桌面歌词栏
│   │   ├── Guestbook.vue       # 留言墙
│   │   ├── DailyFortune.vue    # 每日运势
│   │   ├── SecretQuiz.vue      # 秘密答题
│   │   ├── SecretRoom.vue      # 密室彩蛋
│   │   ├── AchievementsStats.vue # 成就图鉴
│   │   ├── Achievement_01~08.vue  # 8 个成就解锁页
│   │   ├── HiddenAchievement_01~02.vue  # 2 个隐藏成就
│   │   ├── RunGameSelector.vue # 跑酷游戏入口
│   │   └── RunGame_TheLostRealm.vue # The Lost Realm 跑酷
│   ├── data/
│   │   └── hitokoto.json       # 一言语录数据
│   ├── styles/
│   │   └── mobile-optimization.css
│   ├── utils/
│   │   └── supabase.js / storage.js
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── vue.config.js
└── package.json
```

## 🎮 功能列表

### 🏠 首页 `/index`
- 渐变装饰标题 + 白色光晕 + 细描边
- 深色壁纸背景（idle 后延迟加载，不阻塞首屏）
- 中英双语简介（点击切换）
- 社交链接（微信、GitHub、邮箱、QQ 音乐等）
- 实时数字时钟
- 一言随机语录（点击刷新）
- 背景音乐（用户交互后延迟加载）
- 公司信息弹窗

### 👤 关于页面 `/who_i_am`
- 自我介绍 + 技术能力展示
- 彩蛋入口：
  - 点击次数成就（50 次 → 闲的蛋疼，60 次 → 捣蛋专家）
  - 秘密答题入口（连续点击 20 次）
  - 今日运势入口

### 🏆 成就系统（10 项）
**8 个普通成就：**

| 成就 | 解锁条件 |
|------|----------|
| 闲的蛋疼 | 关于页面点击按钮 50 次 |
| 捣蛋专家 | 闲的蛋疼页面继续点击 60 次 |
| 摸鱼精灵 | 施工进度低时点击施工精灵 |
| 最佳损友 | 答对所有秘密题目 |
| 鸿运当头 | 首次抽到「大吉」 |
| 逢凶化吉 | 首次抽到「大凶」 |
| 探索者 | 发现隐藏内容 |
| 主题切换者 | 切换深浅主题 |

**2 个隐藏成就：**
- **天命所归**：集齐全部 7 种运势
- **音乐爱好者**：首页停留播放音乐

成就图鉴支持粒子特效、未解锁乱码效果、一键重置。

### 🔮 每日运势 `/who_i_am/fortune`
- 7 种运势：大吉 / 吉 / 小吉 / 平 / 小凶 / 凶 / 大凶
- 每日固定（同一天结果不变）
- 集齐全部解锁隐藏成就

### 📝 留言墙 `/guestbook`
- 匿名 / 署名可选
- 管理员密码管理
- Supabase 云端存储，跨设备同步

### 🎱 隐藏小游戏
- 密室内含跑酷游戏入口
- The Lost Realm — Dino Runner 风格跑酷游戏

## 🚀 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 部署到 GitHub Pages
npm run republish
```

