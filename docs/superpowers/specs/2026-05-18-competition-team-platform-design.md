# 大学生竞赛组队平台 — 设计文档

> 日期: 2026-05-18
> 课程: 高级网页设计
> 风格: 波普黑白风（粗黑边框、极高对比度、黄色点缀）
> 技术栈: 纯 HTML5 / CSS3 / Vanilla JS (ES6+)

---

## 1. 目录结构

```
网页课设/
├── index.html                  # 首页
├── views/
│   ├── match.html              # 竞赛详情 + 组队列表
│   ├── post.html               # 发布组队帖
│   ├── community.html          # 社区讨论 + 多级评论
│   └── profile.html            # 个人简历页
├── components/
│   ├── header.js               # 页眉组件（导航、网站名）
│   ├── footer.js               # 页脚组件
│   ├── utils.js                # 工具函数（日期格式化、防抖、fetchJSON）
│   ├── storage.js              # localStorage CRUD 封装
│   ├── validator.js            # 表单正则校验引擎
│   ├── comments.js             # 多级评论递归渲染
│   └── scoreCalculator.js      # 组队吸引力得分算法
├── assets/
│   ├── styles/
│   │   ├── base.css            # CSS 变量、Reset、全局排版
│   │   ├── components.css      # 页眉页脚、卡片、按钮等组件样式
│   │   └── pages.css           # 各页面特有样式
│   ├── icons/                  # SVG 小图标
│   └── images/                 # Logo、装饰图、头像 SVG
├── public/
│   ├── vendor/
│   │   ├── swiper/             # Swiper 库文件（本地引入）
│   │   └── echarts/            # ECharts 库文件（本地引入）
│   ├── data/
│   │   ├── competitions.json   # 竞赛 + 组队模拟数据
│   │   └── community.json      # 社区帖子 + 评论模拟数据
│   ├── images/                 # 大尺寸实景图
│   └── media/                  # 音视频（如有）
└── js/
    ├── index.js                # 首页入口（type="module"）
    ├── match.js                # 详情页入口
    ├── post.js                 # 发布页入口
    ├── community.js            # 社区页入口
    └── profile.js              # 个人页入口
```

---

## 2. 视觉设计系统（波普黑白风）

### 色彩体系

```css
:root {
  --color-black: #0a0a0a;
  --color-white: #fafafa;
  --color-yellow: #FFD600;
  --color-gray-light: #f0f0f0;
  --color-gray-mid: #b0b0b0;
  --color-gray-dark: #333;
  --border-thick: 4px solid var(--color-black);
  --border-heavy: 6px solid var(--color-black);
  --shadow-pop: 6px 6px 0 var(--color-black);
  --radius: 0;
}
```

### 核心视觉规则

| 元素 | 样式 |
|------|------|
| 卡片/区块 | 纯白底 + 4-6px 黑色实线边框 + 黑色硬阴影（无 blur） |
| 按钮 | 黄底黑字 + 粗黑边框，hover 反转为黑底黄字 + 阴影偏移 |
| 标题 | 全大写、字重 900、黑色，黄色下划线装饰 |
| 导航栏 | 纯黑底白字，当前页黄色高亮 |
| 输入框 | 白底黑粗边框，focus 黄色边框 + 黄色外发光 |
| 分割 | 粗黑横线或块状色带 |
| 字体 | `system-ui, -apple-system, sans-serif` |
| 图标 | 线条风 SVG，黑色描边 |

### 波普风手法

- 高对比度黑白块面交替
- 黄色仅用于点缀：按钮、高亮、进度条、badge
- 硬阴影（无 blur）代替柔和投影
- 直角代替圆角，营造锐利感
- 条纹/圆点纹理作装饰背景（可选）

---

## 3. 数据模型

### 3.1 竞赛与组队 `competitions.json`

```json
{
  "competitions": [
    {
      "id": 1,
      "title": "ACM-ICPC 程序设计竞赛",
      "category": "编程",
      "description": "国际大学生程序设计竞赛，三人一队...",
      "deadline": "2026-06-15",
      "maxMembers": 3,
      "tags": ["算法", "C++", "团队合作"],
      "image": "public/images/acm.jpg",
      "teams": [
        {
          "id": 101,
          "captain": "张三",
          "captainAvatar": "assets/images/avatar1.svg",
          "title": "求队友！目标省赛银牌",
          "description": "已有两人，缺一个擅长图论的...",
          "skillsRequired": ["图论", "动态规划"],
          "currentMembers": 2,
          "maxMembers": 3,
          "contact": "微信: zhangsan_01",
          "createdAt": "2026-04-20",
          "score": 85
        }
      ]
    }
  ]
}
```

### 3.2 分类统计（首页饼图）

```json
{
  "categories": [
    { "name": "编程", "value": 8 },
    { "name": "数学建模", "value": 5 },
    { "name": "创新创业", "value": 6 },
    { "name": "设计", "value": 4 },
    { "name": "人工智能", "value": 3 }
  ]
}
```

### 3.3 社区帖子 `community.json`

```json
{
  "posts": [
    {
      "id": 1,
      "author": "李四",
      "avatar": "assets/images/avatar2.svg",
      "title": "组队参加互联网+，有经验的来",
      "content": "我们团队目前有...",
      "category": "组队招募",
      "createdAt": "2026-04-25",
      "likes": 12,
      "comments": [
        {
          "id": 101,
          "author": "王五",
          "content": "我擅长商业计划书，可以加入吗？",
          "createdAt": "2026-04-25",
          "replies": [
            {
              "id": 1011,
              "author": "李四",
              "content": "欢迎！加微信聊",
              "createdAt": "2026-04-26"
            }
          ]
        }
      ]
    }
  ]
}
```

### 3.4 个人简历（localStorage）

```json
{
  "profile": {
    "name": "",
    "school": "",
    "major": "",
    "grade": "",
    "skills": [],
    "competitions": [],
    "achievements": "",
    "contact": "",
    "bio": ""
  }
}
```

---

## 4. 页面设计

### 4.1 首页 `index.html`

| 区域 | 内容 | 技术覆盖 |
|------|------|----------|
| 轮播区 | 热门竞赛 banner，自动轮播 + 手动切换 | Swiper |
| 数据概览 | 竞赛分类饼图 + 关键数据统计卡 | ECharts + Fetch |
| 最新组队 | 卡片列表，从 competitions.json 加载 | Fetch + 模板字面量 |
| 页眉/页脚 | 全站统一导航和版权信息 | 共享组件 |

### 4.2 详情页 `views/match.html`

| 区域 | 内容 | 技术覆盖 |
|------|------|----------|
| 竞赛信息头 | 标题、分类标签、截止倒计时、描述 | 倒计时（浏览器 API） |
| 组队列表 | 该竞赛下所有队伍卡片，按得分排序 | Fetch + 高阶数组方法 |
| 筛选栏 | 按技能、人数筛选队伍 | DOM 交互（动态视图更新） |

### 4.3 发布页 `views/post.html`

| 区域 | 内容 | 技术覆盖 |
|------|------|----------|
| 组队表单 | 队伍名称、技能要求、人数上限、描述、联系方式 | 表单正则校验 |
| 实时得分 | 填写过程中右侧实时显示"组队吸引力得分" | 实时计算逻辑 |
| 提交预览 | 提交前弹出预览卡片确认 | DOM 交互 |

**校验规则：**

| 字段 | 规则 | 错误提示 |
|------|------|----------|
| 队伍名称 | `/^.{2,20}$/` | 队伍名称 2-20 字 |
| 联系方式 | `/^(微信\|QQ\|邮箱):.+/` | 请按格式填写联系方式 |
| 人数上限 | `/^([2-9]\|10)$/` | 人数 2-10 人 |
| 描述 | 长度 10-500 字 | 描述 10-500 字 |

**得分算法（满分 100）：**

- 完整度（必填项完成比例）× 40 分
- 技能标签丰富度 × 20 分
- 描述长度和质量 × 20 分
- 联系方式有效 × 20 分

### 4.4 社区页 `views/community.html`

| 区域 | 内容 | 技术覆盖 |
|------|------|----------|
| 帖子列表 | 从 community.json 加载，卡片式展示 | Fetch + 模板字面量 |
| 多级评论 | 无限嵌套回复，递归渲染 | DOM 交互（递归组件） |
| 点赞/回复 | 点赞计数、展开回复输入框 | DOM 交互 + 事件委托 |
| 分类过滤 | 组队招募/经验分享/问题求助 | 高阶数组方法 filter |

**多级评论结构：** 递归渲染，每层缩进 24px，最多 5 层深度。使用事件委托处理回复按钮点击。

### 4.5 个人页 `views/profile.html`

| 区域 | 内容 | 技术覆盖 |
|------|------|----------|
| 简历编辑 | 表单：姓名、学校、专业、年级、技能、竞赛经历、成就、联系方式、简介 | 表单校验 |
| 简历预览 | 右侧实时渲染简历卡片 | DOM 交互 |
| 持久化 | 自动保存到 localStorage，刷新不丢失 | localStorage |
| 导出/清空 | 导出为 JSON / 清空重置 | 浏览器 API |

---

## 5. JS 模块架构

### 依赖关系

```
js/index.js ──────┐
js/match.js ──────┤
js/post.js ───────┼──→ components/header.js
js/community.js ──┤    components/footer.js
js/profile.js ────┤    components/utils.js
                  │    components/storage.js
                  │    components/validator.js
                  │    components/scoreCalculator.js
                  │    components/comments.js
                  │
                  └──→ public/vendor/swiper/  (首页)
                       public/vendor/echarts/ (首页)
```

### 模块职责

| 模块 | 职责 | 导出 |
|------|------|------|
| `header.js` | 渲染导航栏，高亮当前页 | `renderHeader(currentPage)` |
| `footer.js` | 渲染页脚 | `renderFooter()` |
| `utils.js` | 日期格式化、防抖、fetchJSON 封装 | `fetchJSON`, `formatDate`, `debounce`, `$` |
| `storage.js` | localStorage 增删改查 | `saveProfile`, `loadProfile`, `clearProfile` |
| `validator.js` | 统一正则校验引擎 | `validateForm(formData, rules)` |
| `scoreCalculator.js` | 组队吸引力得分算法 | `calculateScore(formData)` |
| `comments.js` | 递归渲染多级评论 | `renderComments(comments, depth)` |

### 编码约定

- 所有页面 JS 入口使用 `<script type="module">`
- 页眉页脚通过 JS 动态注入，避免 HTML 重复
- 事件绑定使用事件委托
- Fetch 统一走 `utils.fetchJSON`
- localStorage 统一走 `storage.js`
- 使用 AI 辅助的代码块加注释 `// 此功能由 AI 辅助生成并调试`

---

## 6. 技术指标覆盖矩阵

| # | 技术指标 | 实现位置 |
|---|----------|----------|
| 1 | ES6+（模板字面量、箭头函数、解构、高阶数组） | 全站 JS |
| 2 | DOM 交互（动态视图更新） | 社区多级评论、详情页筛选、发布预览 |
| 3 | 表单校验 + 数据计算 | 发布页表单 + 得分、个人页校验 |
| 4 | 浏览器 API（localStorage、倒计时） | 个人页持久化、详情页倒计时 |
| 5 | Fetch 异步请求 | 首页加载竞赛数据、社区加载帖子 |
| 6 | ECharts | 首页分类饼图 |
| 7 | Swiper | 首页轮播 |

5 个功能，7 项技术全覆盖，每页至少 1 个 JS 功能。

---

## 7. 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 文件名 | 小写英文，语义化，`-` 分隔 | `community.html`, `score-calculator.js` |
| CSS 类名 | BEM 简化版 | `.card__title--active` |
| JS 变量/函数 | 小驼峰 | `fetchJSON`, `renderComments` |
| JS 常量 | 全大写下划线 | `MAX_COMMENT_DEPTH` |
| HTML ID | 小写英文，语义化 | `id="hero-swiper"` |
| JSON 键名 | 小驼峰 | `createdAt`, `maxMembers` |
