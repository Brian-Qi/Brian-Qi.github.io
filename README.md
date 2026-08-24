# Briandolph Qi 的个人网站

> Vue 3 搭建的个人主页，集成了壁纸首页、背景音乐、每日运势、成就系统、秘密答题、密室彩蛋、单人跑团游戏等彩蛋功能。

## ✨ 在线预览

- GitHub Pages：<https://briandolph.xyz>

## 🛠️ 技术栈

- **前端框架**：Vue 3 + Composition API
- **构建工具**：Vue CLI 5（vue-cli-service）
- **路由管理**：Vue Router 4（全路由懒加载，History 模式）
- **数据存储**：Supabase（留言墙，通过环境变量配置，未配置时自动降级）
- **样式方案**：SCSS + CSS 自定义属性
- **字体**：LXGW WenKai 霞鹜文楷（npm 包）、Great Vibes、DigifaceWide（本地字体）
- **部署**：GitHub Pages（gh-pages）+ Netlify（Serverless Functions）

## 📁 项目结构

```
briandolph_test/
├── public/                        # 静态资源（构建时直接拷贝到 dist）
│   ├── music/
│   │   ├── bg.mp3                 # 背景音乐（用户首次交互后延迟加载）
│   │   └── da-capo.lrc            # 桌面歌词
│   ├── 壁纸.webp                  # 首页壁纸（idle 后延迟加载）
│   ├── Briandolph_ico.ico         # 站点图标
│   ├── CNAME                      # 自定义域名 briandolph.xyz
│   ├── 404.html                   # GitHub Pages SPA 404 页
│   └── index.html                 # HTML 模板
├── netlify/                       # Netlify Functions（留言墙可选通道，需自行配置环境变量）
│   └── functions/
│       └── add-message.js
├── src/
│   ├── assets/
│   │   ├── fonts/                 # 本地字体（DigifaceWide / Great Vibes）
│   │   └── logo.png
│   ├── components/
│   │   ├── ComingSoon.vue         # 入口过渡页 `/`
│   │   ├── NewIndex.vue           # 新首页 `/index`
│   │   ├── Index.vue              # 旧首页（未挂载路由，保留备用）
│   │   ├── WhoIAm.vue             # 关于我 `/who_i_am`
│   │   ├── CompanyInfo.vue        # 公司信息弹窗
│   │   ├── LyricBar.vue           # 桌面歌词栏
│   │   ├── Guestbook.vue          # 留言墙
│   │   ├── DailyFortune.vue       # 每日运势
│   │   ├── SecretQuiz.vue         # 秘密答题
│   │   ├── SecretRoom.vue         # 密室彩蛋
│   │   ├── AchievementsStats.vue  # 成就图鉴
│   │   ├── Achievement_01~08.vue  # 8 个成就解锁页
│   │   ├── HiddenAchievement_01~02.vue  # 2 个隐藏成就
│   │   ├── RunGameSelector.vue    # 单人跑团入口
│   │   └── RunGame_TheLostRealm.vue    # 遗落之境（文本冒险）
│   ├── data/
│   │   └── hitokoto.json          # 一言语录数据
│   ├── styles/
│   │   ├── mobile-optimization.css
│   │   └── mobile-utils.css
│   ├── utils/
│   │   ├── storage.js             # localStorage 统一管理
│   │   ├── supabase.js            # Supabase 客户端（留言墙）
│   │   ├── helpers.js             # 工具函数（simpleHash 等）
│   │   ├── router-persistence.js  # 路由持久化
│   │   ├── env-test.js            # 环境变量自检
│   │   └── router-debug.js        # 路由调试
│   ├── router/
│   │   └── index.js               # 全部路由定义（懒加载）
│   ├── App.vue                    # 根组件（全局主题 / 壁纸 / 导航 / 音乐）
│   └── main.js
├── vue.config.js
├── .env.example                   # 环境变量示例
└── package.json
```

## 🎮 功能列表

### 🏠 入口过渡页 `/`
- 施工进度 + 施工精灵彩蛋（进度低时点击触发「摸鱼精灵」成就）
- 点击姓名进入关于页
- “平行宇宙”入口跳转新首页 `/index`
- 访问首页后返回时触发隐藏成就「回到起点」

### 🏠 首页 `/index`（NewIndex.vue）
- 入场动画遮罩（粒子特效 + 头像点击进入）
- 头像 + 姓名 + 副标题
- 中英双语简介（点击切换）
- 社交链接（GitHub、Email、公司信息弹窗、返回入口）
- 实时日期与数字时钟
- 一言随机语录（点击刷新，数据来自本地 `hitokoto.json`）
- 背景音乐（用户首次交互后延迟加载，随壁纸模式启停）
- 桌面歌词（解析 `music/da-capo.lrc`）
- 壁纸背景（`/壁纸.webp`，首屏渲染后延迟加载）
- 时间问候 Toast

### 👤 关于页面 `/who_i_am`
- 四屏竖向滚动：当前身份 / 在搞啥 / 不靠谱能力图鉴 / 彩蛋区
- 彩蛋入口：
  - 点击次数成就（50 次 → 闲的蛋疼，60 次 → 捣蛋专家）
  - 秘密按钮（连续点击 20 次进入秘密答题，已访问过密室可直接进入）
  - 今日运势入口

### 🏆 成就系统（8 个普通 + 2 个隐藏）

**8 个普通成就：**

| 成就 | 解锁条件 |
|------|----------|
| 闲的蛋疼 | 关于页彩蛋按钮点击 50 次 |
| 捣蛋专家 | 关于页彩蛋按钮点击 60 次 |
| 摸鱼精灵 | 施工进度低时点击施工精灵 |
| 最佳损友 | 答对全部 10 道秘密题目 |
| 鸿运当头 | 首次抽到「大吉」 |
| 逢凶化吉 | 首次抽到「大凶」 |
| 逆规寻真 | 发现隐藏内容（探索者） |
| 光影穿梭 | 切换深浅主题 20 次 |

**2 个隐藏成就：**
- **天命所归**：集齐全部 7 种运势
- **回到起点**：访问新首页后返回入口过渡页（Da Capo 彩蛋）

成就图鉴（`/achievements`）支持粒子特效、未解锁乱码效果、完成度统计与一键重置。

### 🔮 每日运势 `/who_i_am/fortune`
- 7 种运势：大吉 / 吉 / 小吉 / 平 / 小凶 / 凶 / 大凶
- 按“用户标识 + 日期”确定性生成，同一天结果不变
- 集齐全部 7 种解锁隐藏成就「天命所归」

### 🔐 秘密答题 `/who_i_am/secret_quiz`
- 10 道身份验证题（单选 / 多选 / 填空）
- 全部答对解锁「最佳损友」
- 已访问过密室可跳过答题直接进入

### 🔮 秘密房间 `/who_i_am/secret_quiz/secret_room`
- 留言墙入口
- 单人跑团入口

### 📝 留言墙 `/guestbook`
- 匿名 / 署名可选
- Supabase 云端存储，跨设备同步（未配置时自动降级）
- 管理员密码管理，管理员可删除留言

### 🎲 单人跑团（隐藏彩蛋游戏）
- 秘密房间入口 → 选择剧本（当前 1 个：遗落之境）
- The Lost Realm — 文本冒险游戏：意志 / 洞察属性、物品收集、5 个结局、打字机文本与冒险日志
- 结局进度本地保存（`localStorage`）

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 部署到 GitHub Pages（predeploy 自动构建）
npm run deploy

# 强制清理 dist 后重新构建并部署
npm run redeploy

# 构建并推送到 GitHub Pages 仓库（Brian-Qi/Brian-Qi.github.io）
npm run republish

# 提交 README 变更
npm run readme
```

## 🔧 环境变量

参考 `.env.example` 复制为 `.env` 后填写：

- `VUE_APP_SUPABASE_URL` / `VUE_APP_SUPABASE_ANON_KEY`：Supabase 留言墙配置
- `VUE_APP_ADMIN_PASSWORD`：留言墙管理员密码
- `VUE_APP_SECRET_KEY` / `VUE_APP_API_TIMEOUT` / `VUE_APP_DEBUG_MODE` / `VUE_APP_VERSION`：其他配置项
*（内容由AI生成，仅供参考）*
