# 浏览器主页 - 实现计划

## 背景
从零构建一个极简风格浏览器主页，使用 Vue 3。项目目录：`/Users/mazhiguo/workspace-cli/main_page`。

## 技术选型
- **Vue 3**（Vite + Composition API + `<script setup>`）
- 不需要路由（单页面）
- CSS：原生 CSS + CSS 自定义属性（用于亮色/暗色主题切换）
- 视觉风格：极简设计，减少视觉噪音，突出核心功能
- **Docker 容器化**：开发构建全部在 Docker 内完成，不污染本地环境
  - 开发阶段：Docker 容器内运行 `npm run dev`，Vite HMR 热更新
  - 构建产物：多阶段构建，最终打包为 nginx 静态镜像
  - 部署：`docker compose up` 一键启动

## 需求清单

### 1. 背景
- 通过 `https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1` 获取必应每日壁纸
- 获取失败时降级为简单的 CSS 渐变色背景
- 文字区域加半透明遮罩层，保证可读性

### 2. 时钟与问候语
- 大号数字时钟：HH:MM:SS，24 小时制，每秒刷新
- 下方显示日期："2026年5月30日 星期五"（中文格式）
- 根据时段显示问候语：早上好（5-12点）、下午好（12-18点）、晚上好（18-5点）

### 3. 搜索栏
- 居中搜索输入框，带搜索引擎切换（下拉或标签切换）
- 支持：Google、Bing、百度
- 页面加载后自动聚焦搜索框
- 回车在新标签页打开搜索结果
- 选中的搜索引擎持久化到 localStorage

### 4. 天气组件
- 使用免费天气 API（Open-Meteo，无需 API Key）
- 显示：城市名、温度、天气图标/描述
- 通过浏览器 Geolocation API 获取位置（需用户授权）
- 降级方案：用户拒绝定位时默认显示北京天气
- 放在时钟区域附近，小巧不抢眼

### 5. 常用网站（书签网格）
- 可配置的网站快捷方式网格（图标 + 名称）
- 默认预置几个：GitHub、Bilibili、知乎、微博等
- 通过设置面板进行 添加/编辑/删除
- 支持拖拽排序（HTML5 原生拖拽 API）
- 自动获取网站 favicon 作为图标

### 6. 亮色/暗色模式
- 角落放置切换按钮（太阳/月亮图标）
- 使用 CSS 自定义属性实现主题切换
- 偏好设置保存到 localStorage
- 默认跟随系统主题（`prefers-color-scheme`）

### 7. Docker 容器化
- 所有开发、构建操作均在 Docker 容器内完成，不污染本地环境
- 开发时通过 docker compose 挂载源码目录，支持 Vite HMR 热更新
- 多阶段 Docker 构建：第一阶段 Node 镜像编译 Vite 项目，第二阶段 nginx 镜像托管静态文件
- 最终产物是一个轻量的 nginx 静态站点镜像，通过 `docker compose up` 一键启动

### 8. 配置管理
- 配置分为两部分，分别存储在不同的 localStorage 键中，互不干扰：
  - `hp_settings`：系统设置（搜索引擎选择、主题模式、天气城市等）
  - `hp_bookmarks`：书签列表（常用网站的名称、URL、图标、排序）
- 自动同步到 localStorage，数据变更时即时保存
- 导出：下载 `homepage-config.json` 文件（包含 settings 和 bookmarks 两部分）
- 导入：通过文件选择器上传 JSON 并应用配置
- 重置：一键恢复默认配置（同时清空 settings 和 bookmarks 两个键）
- 导入时可选择合并或覆盖现有书签

## 组件树

```
App.vue（根组件，持有全局状态）
├── Background.vue          — 必应每日壁纸 / 降级渐变背景
├── ClockSection.vue        — 时钟、日期、问候语
├── WeatherWidget.vue       — 天气显示（时钟附近）
├── SearchBar.vue           — 搜索输入框 + 搜索引擎切换
├── BookmarkGrid.vue        — 可拖拽书签网格
│   └── BookmarkItem.vue    — 单个书签（图标 + 名称）
├── SettingsPanel.vue       — 侧滑设置面板（管理书签）
│   └── BookmarkForm.vue    — 添加/编辑书签表单
├── ThemeToggle.vue         — 亮色/暗色模式切换按钮
└── ConfigTools.vue         — 导出/导入/重置按钮（放在设置面板内）
```

## 数据流

```
App.vue（唯一数据源）
  ├── reactive state: 
  │     ├── settings: { searchEngine, theme, weatherCity, ... }
  │     └── bookmarks: [{ id, name, url, icon }, ...]
  ├── localStorage：
  │     ├── hp_settings → 系统设置
  │     └── hp_bookmarks → 书签列表
  ├── watch → 两部分各自独立同步到 localStorage
  └── 通过 props 向下传递，通过 emit 向上通知
```

## 文件结构

```
main_page/
├── index.html
├── package.json
├── vite.config.js
├── Dockerfile                  — 多阶段构建（Node 编译 + nginx 托管）
├── docker-compose.yml          — 开发/生产环境编排
├── nginx.conf                  — nginx 静态站点配置
├── .dockerignore
├── public/
│   └── favicon.ico
└── src/
    ├── main.js
    ├── App.vue
    ├── assets/
    │   └── style.css                  — 全局样式 + CSS 变量（主题色）
    ├── composables/
    │   ├── useClock.js                — 响应式时钟 + 问候语
    │   ├── useConfig.js               — localStorage 读写、导出导入
    │   ├── useWeather.js              — 定位 + 天气 API 请求
    │   ├── useBackground.js           — 必应壁纸获取
    │   └── useTheme.js                — 亮色/暗色模式逻辑
    └── components/
        ├── Background.vue
        ├── ClockSection.vue
        ├── WeatherWidget.vue
        ├── SearchBar.vue
        ├── BookmarkGrid.vue
        ├── BookmarkItem.vue
        ├── SettingsPanel.vue
        ├── ThemeToggle.vue
        └── ConfigTools.vue
```

## 实现顺序

1. **脚手架** — 通过 Docker 容器运行 `npm create vite@latest`，初始化 Vue 模板，清理模板代码
2. **Docker 化** — 编写 Dockerfile（多阶段构建）、docker-compose.yml、nginx.conf、.dockerignore
3. **全局样式 + CSS 变量** — 定义亮色/暗色主题 token，基础排版和布局
4. **useTheme + ThemeToggle** — 暗色/亮色切换，跟随系统偏好
5. **useBackground + Background** — 必应 API 获取壁纸 + 渐变降级
6. **useClock + ClockSection** — 响应式时钟、日期、问候语
7. **SearchBar** — 输入框 + 搜索引擎切换，localStorage 持久化
8. **useWeather + WeatherWidget** — 定位 + Open-Meteo API + 展示
9. **BookmarkItem + BookmarkGrid** — 书签展示网格 + HTML5 拖拽排序
10. **SettingsPanel** — 添加/编辑/删除书签的设置面板
11. **useConfig** — localStorage 同步、导出 JSON、导入 JSON、重置
12. **构建镜像** — `docker compose build` 构建生产镜像，`docker compose up -d` 启动验证

## 外部 API 与依赖

| 功能 | 数据源 | 说明 |
|------|--------|------|
| 必应壁纸 | `bing.com/HPImageArchive.aspx` | 无需 API Key |
| 天气 | `api.open-meteo.com` | 免费，无需 Key，支持经纬度查询 |
| 城市名 | Open-Meteo Geocoding API 或浏览器定位 | 免费 |
| 网站图标 | `https://www.google.com/s2/favicons?domain=xxx&sz=64` | 免费，广泛使用 |
| 拖拽排序 | 原生 HTML5 Drag and Drop API | 无需引入第三方库 |

## 验证方式
1. `docker compose up dev` 启动开发容器 → 访问页面，时钟每秒走动，问候语正确显示
2. `docker compose build && docker compose up -d` 构建并启动生产镜像 → 访问 `http://localhost:8080`
3. 搜索测试：输入关键词回车 → 新标签页用选中搜索引擎打开搜索结果
4. 切换搜索引擎后刷新页面 → 选择保留
5. 书签：添加/编辑/删除 → 持久化；拖拽排序 → 顺序保留
6. 暗色/亮色切换 → 即时生效；刷新页面 → 偏好保留
7. 天气：授权定位 → 显示当地天气；拒绝 → 降级显示北京天气
8. 配置：导出下载 JSON → 修改后导入 → 配置更新；重置 → 恢复默认
9. 背景：正常加载必应壁纸；断网刷新 → 显示降级渐变背景
