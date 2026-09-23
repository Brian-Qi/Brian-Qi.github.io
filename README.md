# Briandolph Qi 的个人网站

> Vue 3 搭建的个人主页：入口过渡页、首页、关于、成就图鉴、每日运势、摸鱼区（留言墙 / 单人跑团 / ARG 入口）等。

> ⚠️ **注意**：摸鱼区里的 ARG《第五张财签》是一个**独立项目，不在本仓库内**，详见文末[「相关项目」](#-相关项目)。

## ✨ 在线预览

- <https://briandolph.xyz>

## 🛠️ 技术栈

- **前端框架**：Vue 3 + Composition API
- **构建工具**：Vue CLI 5（webpack）
- **路由**：Vue Router 4（全路由懒加载，History 模式）
- **样式**：SCSS + CSS 自定义属性（`--app-*` 变量集中在 `App.vue`，实际已抽到 `src/styles/app.css`）；
  响应式 / 流体排版见 `src/styles/mobile-optimization.css` 与 `mobile-utils.css`（由 `src/styles/app.css` 引入）
- **字体**：LXGW WenKai 霞鹜文楷（npm 包 `lxgw-wenkai-webfont`）、`DigifaceWide` / `GreatVibes`（本地字体）
- **留言墙数据**：自建 Node 后端（`/api`，Express + MySQL，部署于服务器 `/opt/guestbook-api`），
  管理员登录由**后端**校验并下发 token（前端只存 `sessionStorage`）
- **部署**：Nginx 自建服务器（静态资源 + `/api` 反向代理）。仓库只存源码——构建产物与本地备份均不入库

## 📁 项目结构

```
briandolph_test/
├── public/                        # 静态资源（构建时原样拷贝到 dist）
│   ├── index.html                 # HTML 模板
│   ├── 404.html                   # GitHub Pages SPA 兜底（nginx 环境走路由兜底）
│   ├── CNAME                      # 自定义域名 briandolph.xyz（gh-pages 用）
│   └── Briandolph_ico.ico
├── src/
│   ├── components/
│   │   ├── ComingSoon.vue          # 入口过渡页 `/`
│   │   ├── company/                # 公司展示站 `/index/*`
│   │   │   ├── CompanyLayout.vue   # 站壳：页脚 + 引入 company.css
│   │   │   ├── CompanyHome.vue     # 首页 `/index`
│   │   │   ├── CompanyAbout.vue    # 关于我们 `/index/about`
│   │   │   ├── CompanyServices.vue # 业务范围 `/index/services`
│   │   │   ├── CompanyWorks.vue    # 作品案例 `/index/works`
│   │   │   └── CompanyContact.vue  # 联系我们 `/index/contact`
│   │   ├── Home.vue                # 个人首页 `/self`
│   │   ├── WhoIAm.vue              # 关于我 `/self/who_i_am`
│   │   ├── Guestbook.vue           # 留言墙 `/self/guestbook`
│   │   ├── AdminPanel.vue          # 留言墙管理控制台（按住标题进入）
│   │   ├── DailyFortune.vue        # 每日运势 `/self/who_i_am/fortune`
│   │   ├── Moyu.vue                # 摸鱼区 `/self/moyu`（留言墙 / 单人跑团 / ARG 入口）
│   │   ├── RunGameSelector.vue     # 单人跑团选择 `/self/moyu/run_game`
│   │   ├── RunGame_TheLostRealm.vue# 遗落之境（文本冒险）
│   │   ├── AchievementsStats.vue   # 成就图鉴 `/self/achievements`
│   │   ├── Achievement_01/02/03/05/06/07/08.vue  # 7 个普通成就解锁页
│   │   ├── HiddenAchievement_01.vue              # 隐藏成就「天命所归」
│   │   └── NotFound.vue            # 404 兜底页 `/:pathMatch(.*)*`
│   ├── data/
│   │   ├── company.js              # 公司公开信息（公司站与页脚唯一来源）
│   │   └── hitokoto.json           # 一言语录（本地）
│   ├── router/index.js             # 全部路由（懒加载 + 旧路径重定向 + 404 兜底）
│   ├── stores/                    # （无；状态用组件内 ref + utils/storage）
│   ├── utils/
│   │   ├── storage.js              # localStorage 统一管理（含 STORAGE_KEYS）
│   │   ├── messages.js             # 留言墙 /api 数据层（含管理员 token）
│   │   ├── helpers.js              # 工具函数
│   │   └── router-persistence.js   # 路由持久化 / 刷新恢复
│   ├── styles/
│   │   ├── app.css                 # 全局布局 / 导航 / 主题变量
│   │   ├── company.css             # 公司站共用样式
│   │   ├── achievements-stats.css  # 以下为超大组件外抽的样式
│   │   ├── coming-soon.scss
│   │   ├── guestbook.css
│   │   ├── who-i-am.css
│   │   ├── run-game-the-lost-realm.css
│   │   ├── mobile-optimization.css
│   │   └── mobile-utils.css
│   ├── App.vue                     # 根组件（主题 / 导航 / 布局）
│   └── main.js
├── vue.config.js
├── .env.example                    # 环境变量示例（本项目默认不需要任何变量）
└── package.json
```

## 🎮 功能与路由

站点分两块：**公司展示站**（`/index/*`，对外）与**个人站**（`/self/*`）。

### 公司展示站（`/index/*`）

| 路由 | 页面 | 说明 |
|------|------|------|
| `/index` | 首页 | 工作室简介、能力亮点、作品速览、合作入口 |
| `/index/about` | 关于我们 | 工作室介绍、经营者、工商登记信息表 |
| `/index/services` | 业务范围 | 经营范围按能力方向归类 + 合作流程 |
| `/index/works` | 作品案例 | 公开作品（**ARG《第五张财签》** → `/arg_01/`）与在研项目 |
| `/index/contact` | 联系我们 | 邮箱 / GitHub / 地址与登记信息 |

> 公司站各页带 `meta.company`，顶部导航栏据此切换为公司导航（品牌名也换成工作室名）；公司信息统一取自 `src/data/company.js`。

### 个人站（`/self/*`）

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 入口过渡页 | 施工进度 + 施工精灵彩蛋（进度低时点击得「摸鱼精灵」）；点姓名进关于页；「平行宇宙」入口进个人首页 `/self` |
| `/self` | 个人首页 | 头像 / 中英双语简介 / 实时时钟 / 一言 / 社交链接（含「工作室」入口）/ 主题切换 |
| `/self/who_i_am` | 关于我 | 四屏竖向滚动；彩蛋区：点击计数成就、今日运势、摸鱼区入口 |
| `/self/who_i_am/fortune` | 每日运势 | 7 种运势，按「用户标识 + 日期」确定性生成 |
| `/self/achievements` | 成就图鉴 | 8 个成就（7 普通 + 1 隐藏）、完成度统计、一键重置 |
| `/self/moyu` | 摸鱼区 | 留言墙、单人跑团、**ARG《第五张财签》入口** |
| `/self/moyu/run_game` → `/the_lost_realm` | 单人跑团 | The Lost Realm 文本冒险（当前唯一剧本，处于半成品/占位状态） |
| `/self/guestbook` | 留言墙 | 匿名/署名、分页、点赞；数据存自建后端 MySQL；按住标题进入管理控制台 |
| 其他 | 404 兜底 | 未匹配路径渲染 `NotFound.vue`（此前会白屏） |

> 旧个人路径（`/who_i_am*`、`/moyu*`、`/guestbook`、`/achievements`、`/achieve_slacking`）全部重定向到 `/self/*`，
> 旧「秘密空间」`/who_i_am/secret_quiz*` 指向 `/self/moyu*`，见 `router/index.js`。

## 🏆 成就系统（共 8 个：7 普通 + 1 隐藏）

| 成就 | 组件 | 解锁条件 |
|------|------|----------|
| 闲的蛋疼 | `Achievement_01` | 关于页彩蛋按钮点击 50 次 |
| 捣蛋专家 | `Achievement_02` | 关于页彩蛋按钮点击 60 次 |
| 摸鱼精灵 | `Achievement_03` | 施工进度低时点击施工精灵 |
| 鸿运当头 | `Achievement_05` | 首次抽到「大吉」 |
| 逢凶化吉 | `Achievement_06` | 首次抽到「大凶」 |
| 逆规寻真 | `Achievement_07` | 发现隐藏内容（探索者） |
| 光影穿梭 | `Achievement_08` | 切换深浅主题累计 20 次 |
| **天命所归**（隐藏） | `HiddenAchievement_01` | 集齐全部 7 种运势 |

> 已移除（历史）：秘密答题 /「最佳损友」、Da Capo「回到起点」「音乐爱好者」、桌面歌词、背景音乐、首页壁纸。相关旧文件存于本地 `backup/`（不入库）。

## 📝 留言墙与后端

- 前端数据层：`src/utils/messages.js`，全部走 `/api`（nginx 反代到 `127.0.0.1:3001`）。
- 管理员：`/api/admin/login` 校验密码后由后端下发 token；前端仅将 token 存 `sessionStorage`。
- **安全约定**：管理员口令与任何密钥只存在于**后端**；前端不引入、不硬编码任何口令（`.env.example` 已明确禁止把密钥写成 `VUE_APP_*`）。

## 🚀 本地运行 / 构建 / 部署

```bash
npm install
npm run serve     # 本地开发
npm run build     # 构建到 dist/
```

**主发布路径（nginx 自建服务器）**：构建后把 `dist/` 上传到服务器 `/var/www/briandolph/`。
nginx 关键配置（`/etc/nginx/conf.d/briandolph.conf`）：

- `location / { try_files $uri $uri/ /index.html; }` —— SPA 回退
- `location /api/ { proxy_pass http://127.0.0.1:3001; }` —— 留言墙后端
- 静态资源 30 天缓存 + `index.html` 不缓存 + gzip

**关于 GitHub Pages**：仓库已不再维护 `gh-pages` 分支（历史构建产物已清除），线上只保留 nginx 一处。
`package.json` 里的 `deploy` / `republish` 脚本仍保留——若将来需要重建 Pages 镜像，`npm run deploy` 即可。
> 注意：`public/CNAME` 指向 `briandolph.xyz`，若启用 GitHub Pages 会与 nginx 争夺该域名，请勿同时启用。

## 🔗 相关项目

### 《第五张财签》民俗解谜 ARG —— 独立项目，不在本仓库

个人站摸鱼区（`/self/moyu`，`src/components/Moyu.vue`）有一个「ARG」入口卡片，指向 `/arg_01/`；
公司站的「作品案例」页（`/index/works`）同样展示该项目。

**该 ARG 是完全独立的项目：源码、仓库、构建、部署均与本仓库无关。**

- 独立仓库：<https://github.com/Brian-Qi/ARG_test>
- 在线访问：<https://briandolph.xyz/arg_01/>
- 部署：由 ARG 独立仓库自行构建后，以子目录部署到服务器 `/var/www/briandolph/arg_01/`

> 需要修改、更新或部署 ARG，请前往其独立仓库操作，不要在本仓库中查找其源码。

## License

[CC BY-NC-ND 4.0](LICENSE)：署名 · 非商业性使用 · 禁止演绎。
