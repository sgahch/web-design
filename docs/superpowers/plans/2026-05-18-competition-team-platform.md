# 大学生竞赛组队平台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page college competition team-building platform with pop-art black & white visual style, using pure HTML5/CSS3/Vanilla ES6+ JS.

**Architecture:** Multi-page application with shared components injected via JS modules. Each page has its own entry script (`type="module"`). Shared logic lives in `components/`. Mock JSON data loaded via Fetch API. Third-party libraries (Swiper, ECharts) stored locally in `public/vendor/`.

**Tech Stack:** HTML5, CSS3 (custom properties), Vanilla JS (ES6+ modules), Swiper, ECharts, localStorage, Fetch API

---

## File Map

| File | Responsibility |
|------|---------------|
| `assets/styles/base.css` | CSS variables, reset, global typography, utility classes |
| `assets/styles/components.css` | Header, footer, cards, buttons, form elements, badges |
| `assets/styles/pages.css` | Page-specific layout overrides (hero, grid, comment nesting) |
| `components/header.js` | Renders nav bar, highlights current page |
| `components/footer.js` | Renders footer |
| `components/utils.js` | `fetchJSON`, `formatDate`, `debounce`, `$` selector |
| `components/storage.js` | localStorage CRUD for profile data |
| `components/validator.js` | Regex-based form validation engine |
| `components/scoreCalculator.js` | Real-time team attractiveness score |
| `components/comments.js` | Recursive multi-level comment renderer |
| `public/data/competitions.json` | Mock competition + team data |
| `public/data/community.json` | Mock community posts + comments |
| `index.html` | Homepage with Swiper + ECharts |
| `views/match.html` | Competition detail + team list |
| `views/post.html` | Team posting form |
| `views/community.html` | Community posts + comments |
| `views/profile.html` | Personal resume (localStorage) |
| `js/index.js` | Homepage entry module |
| `js/match.js` | Detail page entry module |
| `js/post.js` | Post page entry module |
| `js/community.js` | Community page entry module |
| `js/profile.js` | Profile page entry module |

---

### Task 1: CSS Design System — `assets/styles/base.css`

**Files:**
- Create: `assets/styles/base.css`

- [ ] **Step 1: Create base.css with CSS variables, reset, and global styles**

```css
/* assets/styles/base.css */
/* 波普黑白风 — CSS 变量、Reset、全局排版 */

:root {
  /* 色彩体系 */
  --color-black: #0a0a0a;
  --color-white: #fafafa;
  --color-yellow: #FFD600;
  --color-gray-light: #f0f0f0;
  --color-gray-mid: #b0b0b0;
  --color-gray-dark: #333;

  /* 边框 */
  --border-thick: 4px solid var(--color-black);
  --border-heavy: 6px solid var(--color-black);
  --border-thin: 2px solid var(--color-black);

  /* 阴影 */
  --shadow-pop: 6px 6px 0 var(--color-black);
  --shadow-pop-sm: 4px 4px 0 var(--color-black);
  --shadow-pop-hover: 8px 8px 0 var(--color-black);

  /* 圆角 — 波普风用直角 */
  --radius: 0;

  /* 字体 */
  --font-main: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* 容器 */
  --container-max: 1200px;
  --container-padding: 24px;
}

/* Reset */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-main);
  color: var(--color-black);
  background-color: var(--color-white);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--color-black);
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}

button, input, textarea, select {
  font: inherit;
  color: inherit;
  border: none;
  background: none;
  outline: none;
}

button {
  cursor: pointer;
}

/* 排版 */
h1, h2, h3, h4, h5, h6 {
  font-weight: 900;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }

/* 容器 */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* 辅助类 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.text-yellow { color: var(--color-yellow); }
.bg-black { background-color: var(--color-black); color: var(--color-white); }
.bg-yellow { background-color: var(--color-yellow); }

/* 波普装饰条纹背景 */
.pop-stripe {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    var(--color-gray-light) 10px,
    var(--color-gray-light) 20px
  );
}

/* 波普圆点背景 */
.pop-dots {
  background-image: radial-gradient(var(--color-gray-mid) 1px, transparent 1px);
  background-size: 16px 16px;
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/styles/base.css
git commit -m "feat: add CSS design system with pop-art variables and reset"
```

---

### Task 2: Component Styles — `assets/styles/components.css`

**Files:**
- Create: `assets/styles/components.css`

- [ ] **Step 1: Create components.css with header, footer, cards, buttons, forms**

```css
/* assets/styles/components.css */
/* 组件样式：页眉、页脚、卡片、按钮、表单、徽章 */

/* ========== 页眉 ========== */
.site-header {
  background-color: var(--color-black);
  color: var(--color-white);
  padding: var(--space-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: var(--border-heavy);
  border-bottom-color: var(--color-yellow);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
}

.site-header__logo {
  font-size: 1.25rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-white);
}

.site-header__logo span {
  color: var(--color-yellow);
}

.site-header__nav {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}

.site-header__nav a {
  color: var(--color-white);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  padding: var(--space-xs) 0;
  border-bottom: 3px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.site-header__nav a:hover,
.site-header__nav a.active {
  color: var(--color-yellow);
  border-bottom-color: var(--color-yellow);
}

/* ========== 页脚 ========== */
.site-footer {
  background-color: var(--color-black);
  color: var(--color-white);
  padding: var(--space-xl) 0;
  margin-top: var(--space-3xl);
  border-top: var(--border-heavy);
  border-top-color: var(--color-yellow);
}

.site-footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
}

.site-footer__text {
  font-size: 0.875rem;
  color: var(--color-gray-mid);
}

/* ========== 按钮 ========== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: var(--border-thick);
  background-color: var(--color-yellow);
  color: var(--color-black);
  box-shadow: var(--shadow-pop-sm);
  transition: all 0.15s ease;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--color-black);
  color: var(--color-yellow);
  box-shadow: var(--shadow-pop);
  transform: translate(-2px, -2px);
}

.btn:active {
  box-shadow: none;
  transform: translate(2px, 2px);
}

.btn--outline {
  background-color: var(--color-white);
  color: var(--color-black);
}

.btn--outline:hover {
  background-color: var(--color-yellow);
  color: var(--color-black);
}

.btn--sm {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.75rem;
}

.btn--block {
  display: flex;
  width: 100%;
}

/* ========== 卡片 ========== */
.card {
  background-color: var(--color-white);
  border: var(--border-thick);
  box-shadow: var(--shadow-pop);
  padding: var(--space-lg);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.card:hover {
  box-shadow: var(--shadow-pop-hover);
  transform: translate(-2px, -2px);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.card__title {
  font-size: 1.125rem;
  font-weight: 900;
  text-transform: uppercase;
}

.card__badge {
  display: inline-block;
  padding: 2px var(--space-sm);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: var(--border-thin);
  background-color: var(--color-yellow);
}

.card__body {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-dark);
}

.card__footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: var(--border-thin);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card__meta {
  font-size: 0.8125rem;
  color: var(--color-gray-mid);
}

/* ========== 表单 ========== */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  margin-bottom: var(--space-xs);
  letter-spacing: 0.03em;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: var(--border-thick);
  background-color: var(--color-white);
  font-size: 0.9375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--color-yellow);
  box-shadow: 0 0 0 3px rgba(255, 214, 0, 0.3);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.form-error {
  font-size: 0.8125rem;
  color: #d32f2f;
  margin-top: var(--space-xs);
  font-weight: 600;
}

.form-input.error,
.form-textarea.error {
  border-color: #d32f2f;
}

/* ========== 标签 ========== */
.tag {
  display: inline-block;
  padding: 2px var(--space-sm);
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid var(--color-black);
  background-color: var(--color-gray-light);
  text-transform: uppercase;
}

.tag--active {
  background-color: var(--color-yellow);
}

/* ========== 得分条 ========== */
.score-bar {
  height: 24px;
  background-color: var(--color-gray-light);
  border: var(--border-thin);
  position: relative;
  overflow: hidden;
}

.score-bar__fill {
  height: 100%;
  background-color: var(--color-yellow);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 900;
}

/* ========== 网格布局 ========== */
.grid {
  display: grid;
  gap: var(--space-lg);
}

.grid--2 { grid-template-columns: repeat(2, 1fr); }
.grid--3 { grid-template-columns: repeat(3, 1fr); }
.grid--4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid--2,
  .grid--3,
  .grid--4 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid--3 { grid-template-columns: repeat(2, 1fr); }
  .grid--4 { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/styles/components.css
git commit -m "feat: add component styles for header, footer, cards, buttons, forms"
```

---

### Task 3: Page Styles — `assets/styles/pages.css`

**Files:**
- Create: `assets/styles/pages.css`

- [ ] **Step 1: Create pages.css with page-specific layouts**

```css
/* assets/styles/pages.css */
/* 各页面特有样式 */

/* ========== 首页 ========== */
.hero {
  padding: var(--space-3xl) 0;
  background-color: var(--color-black);
  color: var(--color-white);
  border-bottom: var(--border-heavy);
  border-bottom-color: var(--color-yellow);
}

.hero__title {
  font-size: 3rem;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.hero__title span {
  color: var(--color-yellow);
}

.hero__subtitle {
  font-size: 1.125rem;
  color: var(--color-gray-mid);
  max-width: 600px;
}

/* 轮播区 */
.hero-swiper {
  margin-top: var(--space-xl);
  border: var(--border-thick);
  box-shadow: var(--shadow-pop);
}

.hero-swiper .swiper-slide {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  background-color: var(--color-gray-light);
  border-right: var(--border-thin);
}

.hero-swiper .swiper-slide:nth-child(odd) {
  background-color: var(--color-yellow);
}

.hero-swiper .swiper-button-next,
.hero-swiper .swiper-button-prev {
  color: var(--color-black);
}

.hero-swiper .swiper-pagination-bullet {
  background: var(--color-black);
  opacity: 0.3;
}

.hero-swiper .swiper-pagination-bullet-active {
  opacity: 1;
  background: var(--color-yellow);
}

/* 数据概览 */
.stats-section {
  padding: var(--space-3xl) 0;
}

.stats-section__title {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.stats-section__title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: var(--color-yellow);
  margin: var(--space-sm) auto 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: start;
}

.chart-container {
  border: var(--border-thick);
  box-shadow: var(--shadow-pop);
  padding: var(--space-lg);
  background: var(--color-white);
  min-height: 350px;
}

.stat-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.stat-card {
  border: var(--border-thick);
  padding: var(--space-lg);
  text-align: center;
  background: var(--color-white);
  box-shadow: var(--shadow-pop-sm);
}

.stat-card__number {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-yellow);
  line-height: 1;
}

.stat-card__label {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: var(--space-xs);
}

/* 最新组队 */
.teasers-section {
  padding: var(--space-3xl) 0;
  background-color: var(--color-gray-light);
  border-top: var(--border-thick);
  border-bottom: var(--border-thick);
}

.teasers-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

/* ========== 详情页 ========== */
.match-hero {
  padding: var(--space-2xl) 0;
  background-color: var(--color-black);
  color: var(--color-white);
  border-bottom: var(--border-heavy);
  border-bottom-color: var(--color-yellow);
}

.match-hero__tags {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.match-hero__tags .tag {
  background-color: var(--color-yellow);
  border-color: var(--color-white);
}

.match-hero__countdown {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border: 2px solid var(--color-yellow);
  font-weight: 900;
  font-size: 1.125rem;
  margin-top: var(--space-md);
}

.match-content {
  padding: var(--space-2xl) 0;
}

.filter-bar {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.filter-bar .tag {
  cursor: pointer;
  transition: background-color 0.15s;
}

.filter-bar .tag:hover,
.filter-bar .tag.active {
  background-color: var(--color-yellow);
}

.team-card {
  position: relative;
}

.team-card__score {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-yellow);
}

.team-card__captain {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.team-card__avatar {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-black);
  background-color: var(--color-gray-light);
}

/* ========== 发布页 ========== */
.post-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xl);
  padding: var(--space-2xl) 0;
  align-items: start;
}

.post-form-section {
  border: var(--border-thick);
  box-shadow: var(--shadow-pop);
  padding: var(--space-xl);
  background: var(--color-white);
}

.post-form-section__title {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: var(--border-thick);
}

.post-preview-section {
  position: sticky;
  top: 100px;
}

.preview-card {
  border: var(--border-heavy);
  box-shadow: var(--shadow-pop);
  padding: var(--space-lg);
  background: var(--color-white);
}

.preview-card__title {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: var(--border-thick);
  font-size: 0.875rem;
}

.score-display {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  border: var(--border-thick);
  text-align: center;
  background: var(--color-gray-light);
}

.score-display__number {
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-yellow);
  line-height: 1;
}

.score-display__label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: var(--space-xs);
}

/* ========== 社区页 ========== */
.community-header {
  padding: var(--space-xl) 0;
  background: var(--color-black);
  color: var(--color-white);
  border-bottom: var(--border-heavy);
  border-bottom-color: var(--color-yellow);
}

.community-tabs {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.community-tabs .tag {
  cursor: pointer;
  border-color: var(--color-white);
  color: var(--color-white);
  background: transparent;
}

.community-tabs .tag.active {
  background: var(--color-yellow);
  color: var(--color-black);
  border-color: var(--color-yellow);
}

.community-content {
  padding: var(--space-2xl) 0;
}

.post-card {
  margin-bottom: var(--space-lg);
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
}

.post-card__avatar {
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-black);
  background: var(--color-gray-light);
}

.post-card__actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.post-card__actions button {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
}

.like-btn.liked {
  color: var(--color-yellow);
}

/* 评论区 */
.comments-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: var(--border-thick);
}

.comments-section__title {
  font-size: 0.875rem;
  margin-bottom: var(--space-md);
}

.comment {
  padding: var(--space-md);
  border: var(--border-thin);
  margin-bottom: var(--space-sm);
  background: var(--color-gray-light);
}

.comment__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
  font-size: 0.8125rem;
}

.comment__author {
  font-weight: 700;
}

.comment__date {
  color: var(--color-gray-mid);
}

.comment__body {
  font-size: 0.9375rem;
  line-height: 1.5;
}

.comment__reply-btn {
  margin-top: var(--space-xs);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-gray-mid);
}

.comment__reply-btn:hover {
  color: var(--color-black);
}

.comment__replies {
  margin-top: var(--space-sm);
}

.comment__reply-form {
  margin-top: var(--space-sm);
  display: none;
}

.comment__reply-form.open {
  display: block;
}

.comment__reply-form textarea {
  width: 100%;
  min-height: 60px;
  padding: var(--space-sm);
  border: var(--border-thin);
  font-size: 0.875rem;
  resize: vertical;
}

.comment__reply-form .btn {
  margin-top: var(--space-xs);
}

/* ========== 个人页 ========== */
.profile-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  padding: var(--space-2xl) 0;
  align-items: start;
}

.profile-form-section {
  border: var(--border-thick);
  box-shadow: var(--shadow-pop);
  padding: var(--space-xl);
  background: var(--color-white);
}

.profile-form-section__title {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: var(--border-thick);
}

.profile-preview-section {
  position: sticky;
  top: 100px;
}

.resume-card {
  border: var(--border-heavy);
  box-shadow: var(--shadow-pop);
  padding: var(--space-xl);
  background: var(--color-white);
}

.resume-card__header {
  text-align: center;
  padding-bottom: var(--space-lg);
  border-bottom: var(--border-thick);
  margin-bottom: var(--space-lg);
}

.resume-card__name {
  font-size: 1.75rem;
  margin-bottom: var(--space-xs);
}

.resume-card__school {
  font-size: 0.9375rem;
  color: var(--color-gray-dark);
  font-weight: 600;
  text-transform: none;
}

.resume-card__section {
  margin-bottom: var(--space-lg);
}

.resume-card__section-title {
  font-size: 0.8125rem;
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--color-yellow);
  display: inline-block;
}

.resume-card__skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.profile-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .hero__title { font-size: 2rem; }
  .stats-grid { grid-template-columns: 1fr; }
  .post-layout { grid-template-columns: 1fr; }
  .profile-layout { grid-template-columns: 1fr; }
  .post-preview-section { position: static; }
  .profile-preview-section { position: static; }
  .site-header__nav { gap: var(--space-md); }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/styles/pages.css
git commit -m "feat: add page-specific styles with responsive layouts"
```

---

### Task 4: Mock Data Files

**Files:**
- Create: `public/data/competitions.json`
- Create: `public/data/community.json`

- [ ] **Step 1: Create competitions.json**

```json
{
  "categories": [
    { "name": "编程", "value": 8 },
    { "name": "数学建模", "value": 5 },
    { "name": "创新创业", "value": 6 },
    { "name": "设计", "value": 4 },
    { "name": "人工智能", "value": 3 }
  ],
  "stats": {
    "totalCompetitions": 26,
    "totalTeams": 58,
    "totalStudents": 142
  },
  "competitions": [
    {
      "id": 1,
      "title": "ACM-ICPC 程序设计竞赛",
      "category": "编程",
      "description": "国际大学生程序设计竞赛，三人一队，在限定时间内解决算法问题。考察团队协作与编程能力。",
      "deadline": "2026-06-15",
      "maxMembers": 3,
      "tags": ["算法", "C++", "团队合作"],
      "image": "public/images/acm.jpg",
      "teams": [
        {
          "id": 101,
          "captain": "张三",
          "title": "求队友！目标省赛银牌",
          "description": "已有两人，缺一个擅长图论和数据结构的队友。我们有区域赛参赛经验，希望找到有算法竞赛基础的同学。",
          "skillsRequired": ["图论", "动态规划", "数据结构"],
          "currentMembers": 2,
          "maxMembers": 3,
          "contact": "微信: zhangsan_01",
          "createdAt": "2026-04-20",
          "score": 92
        },
        {
          "id": 102,
          "captain": "王芳",
          "title": "ACM 新手队，一起学习进步",
          "description": "两个大二学生，刚入门算法竞赛，希望找一个同样热爱编程的队友，一起刷题备赛。",
          "skillsRequired": ["C/C++", "基础算法"],
          "currentMembers": 2,
          "maxMembers": 3,
          "contact": "QQ: 123456789",
          "createdAt": "2026-04-22",
          "score": 65
        }
      ]
    },
    {
      "id": 2,
      "title": "全国大学生数学建模竞赛",
      "category": "数学建模",
      "description": "用数学方法和计算机技术解决实际问题，三人一队，分工为建模、编程、写作。",
      "deadline": "2026-09-10",
      "maxMembers": 3,
      "tags": ["数学", "MATLAB", "论文写作"],
      "image": "public/images/math.jpg",
      "teams": [
        {
          "id": 201,
          "captain": "李明",
          "title": "数学建模缺编程手",
          "description": "我负责建模，另一个同学负责论文写作，急需一个会 MATLAB 或 Python 的编程手。",
          "skillsRequired": ["MATLAB", "Python", "数据分析"],
          "currentMembers": 2,
          "maxMembers": 3,
          "contact": "邮箱: liming@edu.cn",
          "createdAt": "2026-05-01",
          "score": 78
        }
      ]
    },
    {
      "id": 3,
      "title": "互联网+ 大学生创新创业大赛",
      "category": "创新创业",
      "description": "中国高校最大的创新创业赛事，鼓励跨学科组队，将创意转化为商业计划。",
      "deadline": "2026-07-20",
      "maxMembers": 5,
      "tags": ["创业", "商业计划", "路演"],
      "image": "public/images/chuangye.jpg",
      "teams": [
        {
          "id": 301,
          "captain": "赵雪",
          "title": "AI+教育赛道，招募技术合伙人",
          "description": "项目方向是 AI 辅助个性化学习平台，已有初步原型。需要前端开发和产品设计的同学加入。",
          "skillsRequired": ["前端开发", "产品设计", "机器学习"],
          "currentMembers": 3,
          "maxMembers": 5,
          "contact": "微信: zhaoxue_ai",
          "createdAt": "2026-05-05",
          "score": 88
        },
        {
          "id": 302,
          "captain": "孙磊",
          "title": "环保科技项目招人",
          "description": "聚焦校园垃圾分类智能化方案，已有指导老师支持。欢迎有硬件或软件开发经验的同学。",
          "skillsRequired": ["嵌入式开发", "Python", "硬件设计"],
          "currentMembers": 2,
          "maxMembers": 5,
          "contact": "QQ: 987654321",
          "createdAt": "2026-05-08",
          "score": 72
        }
      ]
    },
    {
      "id": 4,
      "title": "全国大学生广告设计大赛",
      "category": "设计",
      "description": "以创意设计为核心，涵盖平面、视频、交互等多种设计方向。",
      "deadline": "2026-08-01",
      "maxMembers": 4,
      "tags": ["平面设计", "PS", "创意"],
      "image": "public/images/design.jpg",
      "teams": [
        {
          "id": 401,
          "captain": "周涵",
          "title": "视觉传达方向组队",
          "description": "寻找擅长 UI/UX 或插画设计的队友，一起冲击国赛。我们已经有两个平面设计师。",
          "skillsRequired": ["UI设计", "插画", "Figma"],
          "currentMembers": 2,
          "maxMembers": 4,
          "contact": "微信: zhouhan_design",
          "createdAt": "2026-05-10",
          "score": 81
        }
      ]
    },
    {
      "id": 5,
      "title": "中国大学生计算机设计大赛",
      "category": "编程",
      "description": "涵盖软件应用开发、物联网、人工智能等多个赛道的综合计算机竞赛。",
      "deadline": "2026-06-30",
      "maxMembers": 3,
      "tags": ["软件开发", "Java", "数据库"],
      "image": "public/images/cs.jpg",
      "teams": [
        {
          "id": 501,
          "captain": "吴杰",
          "title": "Web 应用开发赛道招队友",
          "description": "做一个校园二手交易平台，已有后端框架。缺一个前端和一个测试。",
          "skillsRequired": ["Vue/React", "MySQL", "软件测试"],
          "currentMembers": 1,
          "maxMembers": 3,
          "contact": "邮箱: wujie@stu.edu.cn",
          "createdAt": "2026-05-12",
          "score": 55
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create community.json**

```json
{
  "posts": [
    {
      "id": 1,
      "author": "李四",
      "title": "组队参加互联网+，有经验的来",
      "content": "我们团队目前有三人，方向是 AI+教育，已经完成了初步的市场调研和原型设计。现在需要一个前端开发和一个产品经理角色的同学。项目有指导老师支持，目标是省赛金奖。有兴趣的同学欢迎联系！",
      "category": "组队招募",
      "createdAt": "2026-04-25",
      "likes": 18,
      "comments": [
        {
          "id": 101,
          "author": "王五",
          "content": "我擅长前端开发，Vue 和 React 都可以，有项目经验。可以加微信详细聊一下吗？",
          "createdAt": "2026-04-25",
          "replies": [
            {
              "id": 1011,
              "author": "李四",
              "content": "当然可以！加我微信 lisi_ai，备注互联网+组队。",
              "createdAt": "2026-04-25"
            },
            {
              "id": 1012,
              "author": "王五",
              "content": "好的，已经加了，谢谢！",
              "createdAt": "2026-04-26"
            }
          ]
        },
        {
          "id": 102,
          "author": "赵六",
          "content": "我对产品经理角色感兴趣，之前参加过挑战杯有相关经验。方便聊聊吗？",
          "createdAt": "2026-04-26",
          "replies": [
            {
              "id": 1021,
              "author": "李四",
              "content": "太好了！我们正好缺有经验的产品同学，加微信聊细节吧。",
              "createdAt": "2026-04-26"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "author": "陈七",
      "title": "分享：ACM 区域赛银牌备赛经验",
      "content": "去年有幸拿了区域赛银牌，分享一下我们的备赛经验：1. 每周至少刷 20 道题，保持手感；2. 团队分工明确，有人专攻数据结构，有人专攻数学；3. 模拟赛很重要，每月至少两次三小时模拟；4. 比赛时先通读所有题，从最有把握的开始做。希望对大家有帮助！",
      "category": "经验分享",
      "createdAt": "2026-05-01",
      "likes": 42,
      "comments": [
        {
          "id": 201,
          "author": "钱八",
          "content": "感谢分享！请问你们平时用什么平台刷题？LeetCode 还是 Codeforces？",
          "createdAt": "2026-05-01",
          "replies": [
            {
              "id": 2011,
              "author": "陈七",
              "content": "两个都用。LeetCode 刷专题，Codeforces 打比赛练手速。",
              "createdAt": "2026-05-02"
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "author": "郑九",
      "title": "求助：数学建模论文排版有什么推荐？",
      "content": "第一次参加数学建模竞赛，论文写作完全没经验。请问学长学姐们一般用什么排版？LaTeX 还是 Word？有没有什么模板推荐？",
      "category": "问题求助",
      "createdAt": "2026-05-10",
      "likes": 8,
      "comments": [
        {
          "id": 301,
          "author": "冯十",
          "content": "强烈推荐 LaTeX！排版专业，公式方便，很多美赛模板可以直接用。Word 在最后提交时格式经常出问题。",
          "createdAt": "2026-05-10",
          "replies": []
        },
        {
          "id": 302,
          "author": "卫十一",
          "content": "如果 LaTeX 不熟的话，用 Word 也行，关键是内容要好。我们去年用 Word 也拿了省一。记得用学校提供的模板。",
          "createdAt": "2026-05-11",
          "replies": []
        }
      ]
    },
    {
      "id": 4,
      "author": "刘十二",
      "title": "找队友：蓝桥杯国赛备赛小组",
      "content": "蓝桥杯省赛拿了省一，准备冲国赛。想找两三个同学一起备赛，互相监督刷题、分享解题思路。要求至少有省二以上经验，能保证每天两小时刷题时间。",
      "category": "组队招募",
      "createdAt": "2026-05-14",
      "likes": 15,
      "comments": [
        {
          "id": 401,
          "author": "杨十三",
          "content": "我也进了国赛！C++ 组的，可以一起备赛。加个联系方式？",
          "createdAt": "2026-05-14",
          "replies": [
            {
              "id": 4011,
              "author": "刘十二",
              "content": "好呀！我也是 C++ 组，QQ: 112233445，加我吧。",
              "createdAt": "2026-05-14"
            }
          ]
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add public/data/
git commit -m "feat: add mock JSON data for competitions and community"
```

---

### Task 5: Shared JS Components — `components/utils.js` + `components/storage.js`

**Files:**
- Create: `components/utils.js`
- Create: `components/storage.js`

- [ ] **Step 1: Create utils.js**

```javascript
// components/utils.js
// 工具函数集合

/**
 * 选择器简写
 * @param {string} selector CSS 选择器
 * @param {Element} [context=document] 上下文
 * @returns {Element|null}
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * 选择所有元素
 * @param {string} selector CSS 选择器
 * @param {Element} [context=document] 上下文
 * @returns {NodeListOf<Element>}
 */
export const $$ = (selector, context = document) => context.querySelectorAll(selector);

/**
 * Fetch JSON 数据并解析
 * @param {string} url JSON 文件路径
 * @returns {Promise<any>}
 */
export async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

/**
 * 格式化日期
 * @param {string} dateStr ISO 日期字符串
 * @returns {string} 格式化后的日期 (YYYY-MM-DD)
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 计算剩余天数
 * @param {string} deadlineStr 截止日期
 * @returns {number} 剩余天数（负数表示已过期）
 */
export function daysUntil(deadlineStr) {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * 防抖函数
 * @param {Function} fn 目标函数
 * @param {number} delay 延迟毫秒数
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 生成 SVG 头像（纯色方块 + 首字母）
 * @param {string} name 姓名
 * @returns {string} 内联 SVG 字符串
 */
export function generateAvatar(name) {
  const initial = name.charAt(0);
  return `<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" fill="#0a0a0a"/>
    <text x="18" y="24" text-anchor="middle" fill="#FFD600" font-size="18" font-weight="900" font-family="system-ui">${initial}</text>
  </svg>`;
}
```

- [ ] **Step 2: Create storage.js**

```javascript
// components/storage.js
// localStorage 封装 — 个人简历数据持久化

const STORAGE_KEY = 'competition_platform_profile';

/**
 * 默认简历数据结构
 */
const defaultProfile = {
  name: '',
  school: '',
  major: '',
  grade: '',
  skills: [],
  competitions: [],
  achievements: '',
  contact: '',
  bio: ''
};

/**
 * 加载个人简历
 * @returns {object} 简历数据
 */
export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultProfile, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load profile from localStorage:', e);
  }
  return { ...defaultProfile };
}

/**
 * 保存个人简历
 * @param {object} profile 简历数据
 */
export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile to localStorage:', e);
  }
}

/**
 * 清空个人简历
 */
export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear profile from localStorage:', e);
  }
}

/**
 * 更新简历单个字段
 * @param {string} field 字段名
 * @param {any} value 字段值
 */
export function updateProfileField(field, value) {
  const profile = loadProfile();
  profile[field] = value;
  saveProfile(profile);
}
```

- [ ] **Step 3: Commit**

```bash
git add components/utils.js components/storage.js
git commit -m "feat: add utility functions and localStorage storage module"
```

---

### Task 6: Validation & Score Components — `components/validator.js` + `components/scoreCalculator.js`

**Files:**
- Create: `components/validator.js`
- Create: `components/scoreCalculator.js`

- [ ] **Step 1: Create validator.js**

```javascript
// components/validator.js
// 表单正则校验引擎

/**
 * 校验规则定义
 */
const defaultRules = {
  teamName: {
    pattern: /^.{2,20}$/,
    message: '队伍名称需要 2-20 个字符'
  },
  contact: {
    pattern: /^(微信|QQ|邮箱|手机)\s*[:：]\s*.+/,
    message: '请按格式填写，如：微信: your_id'
  },
  maxMembers: {
    pattern: /^([2-9]|10)$/,
    message: '队伍人数需在 2-10 人之间'
  },
  description: {
    validator: (value) => value.length >= 10 && value.length <= 500,
    message: '描述需要 10-500 个字符'
  }
};

/**
 * 校验单个字段
 * @param {string} value 字段值
 * @param {object} rule 校验规则 { pattern?, validator?, message }
 * @returns {{ valid: boolean, message: string }}
 */
export function validateField(value, rule) {
  const trimmed = value.trim();

  if (rule.pattern) {
    const valid = rule.pattern.test(trimmed);
    return { valid, message: valid ? '' : rule.message };
  }

  if (rule.validator) {
    const valid = rule.validator(trimmed);
    return { valid, message: valid ? '' : rule.message };
  }

  return { valid: true, message: '' };
}

/**
 * 校验整个表单
 * @param {object} formData { fieldName: value, ... }
 * @param {object} [rules=defaultRules] 校验规则集
 * @returns {{ valid: boolean, errors: { [field]: string } }}
 */
export function validateForm(formData, rules = defaultRules) {
  const errors = {};
  let valid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const value = formData[field] ?? '';
    const result = validateField(value, rule);
    if (!result.valid) {
      errors[field] = result.message;
      valid = false;
    }
  }

  return { valid, errors };
}

/**
 * 获取默认校验规则
 * @returns {object}
 */
export function getDefaultRules() {
  return { ...defaultRules };
}
```

- [ ] **Step 2: Create scoreCalculator.js**

```javascript
// components/scoreCalculator.js
// 组队吸引力得分实时计算

/**
 * 计算完整度得分（满分 40）
 * @param {object} formData
 * @returns {number}
 */
function calcCompleteness(formData) {
  const requiredFields = ['teamName', 'description', 'contact', 'maxMembers'];
  const filled = requiredFields.filter(field => {
    const val = formData[field];
    return val && val.toString().trim().length > 0;
  });
  return (filled.length / requiredFields.length) * 40;
}

/**
 * 计算技能丰富度得分（满分 20）
 * @param {object} formData
 * @returns {number}
 */
function calcSkillRichness(formData) {
  const skills = formData.skillsRequired || [];
  const count = Array.isArray(skills) ? skills.length : 0;
  if (count === 0) return 0;
  if (count === 1) return 8;
  if (count === 2) return 14;
  if (count >= 3) return 20;
  return 0;
}

/**
 * 计算描述质量得分（满分 20）
 * @param {object} formData
 * @returns {number}
 */
function calcDescQuality(formData) {
  const desc = (formData.description || '').trim();
  const len = desc.length;
  if (len < 10) return 0;
  if (len < 50) return 8;
  if (len < 100) return 12;
  if (len < 200) return 16;
  return 20;
}

/**
 * 计算联系方式有效性得分（满分 20）
 * @param {object} formData
 * @returns {number}
 */
function calcContactValid(formData) {
  const contact = (formData.contact || '').trim();
  const pattern = /^(微信|QQ|邮箱|手机)\s*[:：]\s*.+/;
  return pattern.test(contact) ? 20 : 0;
}

/**
 * 计算总得分
 * @param {object} formData
 * @returns {number} 0-100
 */
export function calculateScore(formData) {
  const completeness = calcCompleteness(formData);
  const skillRichness = calcSkillRichness(formData);
  const descQuality = calcDescQuality(formData);
  const contactValid = calcContactValid(formData);
  return Math.round(completeness + skillRichness + descQuality + contactValid);
}
```

- [ ] **Step 3: Commit**

```bash
git add components/validator.js components/scoreCalculator.js
git commit -m "feat: add form validator and score calculator components"
```

---

### Task 7: Header/Footer & Comments Components — `components/header.js` + `components/footer.js` + `components/comments.js`

**Files:**
- Create: `components/header.js`
- Create: `components/footer.js`
- Create: `components/comments.js`

- [ ] **Step 1: Create header.js**

```javascript
// components/header.js
// 页眉组件 — 动态注入导航栏

import { $ } from './utils.js';

const NAV_ITEMS = [
  { href: 'index.html', label: '首页', page: 'index' },
  { href: 'views/match.html', label: '竞赛详情', page: 'match' },
  { href: 'views/post.html', label: '发布组队', page: 'post' },
  { href: 'views/community.html', label: '社区', page: 'community' },
  { href: 'views/profile.html', label: '个人中心', page: 'profile' }
];

/**
 * 渲染页眉
 * @param {string} currentPage 当前页面标识
 */
export function renderHeader(currentPage) {
  const header = document.createElement('header');
  header.className = 'site-header';

  // 根据当前页面计算相对路径前缀
  const isSubPage = currentPage !== 'index';
  const prefix = isSubPage ? '../' : '';

  const navLinks = NAV_ITEMS.map(item => {
    const href = isSubPage ? `../${item.href}` : item.href;
    const activeClass = item.page === currentPage ? ' active' : '';
    return `<a href="${href}" class="${activeClass}">${item.label}</a>`;
  }).join('');

  header.innerHTML = `
    <div class="container site-header__inner">
      <a href="${prefix}index.html" class="site-header__logo">
        竞赛<span>组队</span>平台
      </a>
      <nav class="site-header__nav">
        ${navLinks}
      </nav>
    </div>
  `;

  document.body.prepend(header);
}
```

- [ ] **Step 2: Create footer.js**

```javascript
// components/footer.js
// 页脚组件

/**
 * 渲染页脚
 */
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container site-footer__inner">
      <span class="site-footer__text">&copy; 2026 竞赛组队平台 — 大学生竞赛组队一站式服务</span>
      <span class="site-footer__text">高级网页设计课程作品</span>
    </div>
  `;
  document.body.appendChild(footer);
}
```

- [ ] **Step 3: Create comments.js**

```javascript
// components/comments.js
// 多级评论递归渲染

const MAX_DEPTH = 5;

/**
 * 渲染单条评论（含递归子评论）
 * @param {object} comment 评论对象
 * @param {number} depth 当前嵌套深度
 * @returns {string} HTML 字符串
 */
function renderSingleComment(comment, depth) {
  const indent = depth * 24;
  const repliesHTML = comment.replies && comment.replies.length > 0 && depth < MAX_DEPTH
    ? `<div class="comment__replies">
        ${comment.replies.map(r => renderSingleComment(r, depth + 1)).join('')}
       </div>`
    : '';

  return `
    <div class="comment" style="margin-left: ${indent}px" data-comment-id="${comment.id}">
      <div class="comment__header">
        <span class="comment__author">${comment.author}</span>
        <span class="comment__date">${comment.createdAt}</span>
      </div>
      <div class="comment__body">${comment.content}</div>
      ${depth < MAX_DEPTH ? `<button class="comment__reply-btn" data-comment-id="${comment.id}">回复</button>` : ''}
      <div class="comment__reply-form" data-reply-to="${comment.id}">
        <textarea placeholder="写下你的回复..." class="form-input"></textarea>
        <button class="btn btn--sm submit-reply-btn" data-comment-id="${comment.id}">提交回复</button>
      </div>
      ${repliesHTML}
    </div>
  `;
}

/**
 * 渲染评论列表
 * @param {Array} comments 评论数组
 * @returns {string} HTML 字符串
 */
export function renderComments(comments) {
  if (!comments || comments.length === 0) {
    return '<p style="color: var(--color-gray-mid); font-size: 0.875rem;">暂无评论，快来抢沙发吧！</p>';
  }
  return comments.map(c => renderSingleComment(c, 0)).join('');
}

/**
 * 绑定评论区事件（事件委托）
 * @param {Element} container 评论容器元素
 * @param {Function} onReply 回复提交回调 (parentId, content) => void
 */
export function bindCommentEvents(container, onReply) {
  container.addEventListener('click', (e) => {
    const replyBtn = e.target.closest('.comment__reply-btn');
    if (replyBtn) {
      const commentId = replyBtn.dataset.commentId;
      const form = container.querySelector(`.comment__reply-form[data-reply-to="${commentId}"]`);
      if (form) {
        form.classList.toggle('open');
        const textarea = form.querySelector('textarea');
        if (form.classList.contains('open')) {
          textarea.focus();
        }
      }
      return;
    }

    const submitBtn = e.target.closest('.submit-reply-btn');
    if (submitBtn) {
      const commentId = submitBtn.dataset.commentId;
      const form = container.querySelector(`.comment__reply-form[data-reply-to="${commentId}"]`);
      const textarea = form.querySelector('textarea');
      const content = textarea.value.trim();

      if (content.length === 0) {
        textarea.classList.add('error');
        return;
      }

      textarea.classList.remove('error');
      onReply(commentId, content);
      textarea.value = '';
      form.classList.remove('open');
    }
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add components/header.js components/footer.js components/comments.js
git commit -m "feat: add header, footer, and recursive comment components"
```

---

### Task 8: Homepage — `index.html` + `js/index.js`

**Files:**
- Create: `index.html`
- Create: `js/index.js`
- Create: `public/vendor/swiper/` (placeholder — download Swiper bundle)
- Create: `public/vendor/echarts/` (placeholder — download ECharts)

- [ ] **Step 1: Download Swiper and ECharts to vendor/**

```bash
# 创建 vendor 目录
mkdir -p public/vendor/swiper public/vendor/echarts

# 下载 Swiper (ESM bundle)
curl -L -o public/vendor/swiper/swiper-bundle.min.js "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
curl -L -o public/vendor/swiper/swiper-bundle.min.css "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"

# 下载 ECharts
curl -L -o public/vendor/echarts/echarts.min.js "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"
```

> 注：如网络受限，可手动从 CDN 下载后放入对应目录。

- [ ] **Step 2: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>竞赛组队平台 — 首页</title>
  <link rel="stylesheet" href="assets/styles/base.css">
  <link rel="stylesheet" href="assets/styles/components.css">
  <link rel="stylesheet" href="assets/styles/pages.css">
  <link rel="stylesheet" href="public/vendor/swiper/swiper-bundle.min.css">
</head>
<body>
  <main class="site-main">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">找队友，<span>拼竞赛</span></h1>
        <p class="hero__subtitle">一站式大学生竞赛组队平台，覆盖编程、数学建模、创新创业等热门赛道，助你找到最佳队友。</p>
        <!-- Swiper 轮播 -->
        <div class="swiper hero-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">ACM-ICPC 程序设计竞赛</div>
            <div class="swiper-slide">全国大学生数学建模竞赛</div>
            <div class="swiper-slide">互联网+ 创新创业大赛</div>
            <div class="swiper-slide">大学生广告设计大赛</div>
            <div class="swiper-slide">计算机设计大赛</div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </section>

    <!-- 数据概览 -->
    <section class="stats-section">
      <div class="container">
        <h2 class="stats-section__title">平台数据</h2>
        <div class="stats-grid">
          <div class="chart-container">
            <div id="category-chart" style="width: 100%; height: 320px;"></div>
          </div>
          <div class="stat-cards" id="stat-cards">
            <!-- JS 动态渲染 -->
          </div>
        </div>
      </div>
    </section>

    <!-- 最新组队 -->
    <section class="teasers-section">
      <div class="container">
        <div class="teasers-section__header">
          <h2>最新组队</h2>
          <a href="views/match.html" class="btn btn--outline btn--sm">查看全部</a>
        </div>
        <div class="grid grid--3" id="team-teasers">
          <!-- JS 动态渲染 -->
        </div>
      </div>
    </section>
  </main>

  <script type="module" src="js/index.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create js/index.js**

```javascript
// js/index.js
// 首页入口模块

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { fetchJSON, formatDate, generateAvatar } from '../components/utils.js';
import Swiper from '../public/vendor/swiper/swiper-bundle.min.js';
import * as echarts from '../public/vendor/echarts/echarts.min.js';

// 初始化页眉页脚
renderHeader('index');
renderFooter();

// ========== Swiper 轮播 ==========
const swiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
});

// ========== Fetch 数据 + ECharts 饼图 ==========
async function initDashboard() {
  const data = await fetchJSON('public/data/competitions.json');

  // 渲染统计卡片
  const statCards = document.getElementById('stat-cards');
  const { totalCompetitions, totalTeams, totalStudents } = data.stats;
  statCards.innerHTML = `
    <div class="stat-card">
      <div class="stat-card__number">${totalCompetitions}</div>
      <div class="stat-card__label">热门竞赛</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__number">${totalTeams}</div>
      <div class="stat-card__label">招募中的队伍</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__number">${totalStudents}</div>
      <div class="stat-card__label">参与学生</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__number">${data.categories.length}</div>
      <div class="stat-card__label">竞赛分类</div>
    </div>
  `;

  // ECharts 饼图
  const chartDom = document.getElementById('category-chart');
  const chart = echarts.init(chartDom);
  chart.setOption({
    title: {
      text: '竞赛分类分布',
      left: 'center',
      textStyle: {
        fontWeight: 900,
        fontSize: 16,
        fontFamily: 'system-ui'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 项 ({d}%)'
    },
    series: [{
      name: '竞赛分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderWidth: 3,
        borderColor: '#0a0a0a'
      },
      label: {
        fontWeight: 700,
        fontSize: 13
      },
      data: data.categories.map((cat, i) => ({
        ...cat,
        itemStyle: {
          color: i === 0 ? '#FFD600' : i === 1 ? '#333' : i === 2 ? '#b0b0b0' : i === 3 ? '#f0f0f0' : '#666'
        }
      }))
    }]
  });

  // 渲染最新组队卡片（取前 6 条）
  const teasers = document.getElementById('team-teasers');
  const allTeams = data.competitions.flatMap(comp =>
    comp.teams.map(team => ({ ...team, competitionTitle: comp.title }))
  );
  const latestTeams = allTeams.slice(0, 6);

  teasers.innerHTML = latestTeams.map(team => `
    <div class="card team-card">
      <span class="team-card__score">${team.score}分</span>
      <div class="card__header">
        <div>
          <div class="team-card__captain">
            <span class="team-card__avatar">${generateAvatar(team.captain)}</span>
            <span>${team.captain}</span>
          </div>
          <h3 class="card__title">${team.title}</h3>
        </div>
      </div>
      <div class="card__body">
        <p>${team.description.slice(0, 80)}...</p>
        <div style="margin-top: 8px;">
          ${team.skillsRequired.map(s => `<span class="tag">${s}</span>`).join(' ')}
        </div>
      </div>
      <div class="card__footer">
        <span class="card__meta">${team.currentMembers}/${team.maxMembers} 人</span>
        <a href="views/match.html?id=${team.id}" class="btn btn--sm">查看详情</a>
      </div>
    </div>
  `).join('');

  // 响应式图表
  window.addEventListener('resize', () => chart.resize());
}

initDashboard();
```

- [ ] **Step 4: Verify in browser — open index.html, check Swiper autoplay, ECharts pie chart, team cards rendering**

- [ ] **Step 5: Commit**

```bash
git add index.html js/index.js public/vendor/
git commit -m "feat: add homepage with Swiper carousel and ECharts pie chart"
```

---

### Task 9: Match Detail Page — `views/match.html` + `js/match.js`

**Files:**
- Create: `views/match.html`
- Create: `js/match.js`

- [ ] **Step 1: Create views/match.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>竞赛详情 — 竞赛组队平台</title>
  <link rel="stylesheet" href="../assets/styles/base.css">
  <link rel="stylesheet" href="../assets/styles/components.css">
  <link rel="stylesheet" href="../assets/styles/pages.css">
</head>
<body>
  <main class="site-main">
    <!-- 竞赛信息头 -->
    <section class="match-hero" id="match-hero">
      <div class="container">
        <div class="match-hero__tags" id="match-tags"></div>
        <h1 id="match-title">加载中...</h1>
        <p id="match-description" style="max-width: 700px; margin-top: 16px; color: var(--color-gray-mid);"></p>
        <div class="match-hero__countdown" id="match-countdown">
          加载中...
        </div>
      </div>
    </section>

    <!-- 组队列表 -->
    <section class="match-content">
      <div class="container">
        <div class="filter-bar" id="filter-bar">
          <span class="tag tag--active" data-filter="all">全部</span>
        </div>
        <div class="grid grid--2" id="team-list">
          <!-- JS 动态渲染 -->
        </div>
      </div>
    </section>
  </main>

  <script type="module" src="../js/match.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create js/match.js**

```javascript
// js/match.js
// 详情页入口模块 — 竞赛信息 + 倒计时 + 组队列表 + 筛选

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { fetchJSON, daysUntil, formatDate, generateAvatar } from '../components/utils.js';

renderHeader('match');
renderFooter();

let allTeams = [];
let currentFilter = 'all';
let currentCompetition = null;

// ========== 初始化 ==========
async function init() {
  const data = await fetchJSON('../public/data/competitions.json');

  // 取第一个竞赛作为示例（可扩展为 URL 参数匹配）
  const params = new URLSearchParams(window.location.search);
  const compId = parseInt(params.get('id')) || 1;
  currentCompetition = data.competitions.find(c => c.id === compId) || data.competitions[0];

  renderHero(currentCompetition);
  allTeams = currentCompetition.teams;
  renderFilterBar(currentCompetition);
  renderTeams(allTeams);
  startCountdown(currentCompetition.deadline);
}

// ========== 渲染竞赛头部 ==========
function renderHero(comp) {
  document.getElementById('match-title').textContent = comp.title;
  document.getElementById('match-description').textContent = comp.description;

  const tagsEl = document.getElementById('match-tags');
  tagsEl.innerHTML = comp.tags.map(t => `<span class="tag">${t}</span>`).join('');
}

// ========== 倒计时 ==========
function startCountdown(deadline) {
  const countdownEl = document.getElementById('match-countdown');

  function update() {
    const days = daysUntil(deadline);
    if (days > 0) {
      countdownEl.innerHTML = `距离截止还有 <strong>${days}</strong> 天`;
    } else if (days === 0) {
      countdownEl.innerHTML = '<strong>今天截止！</strong>';
    } else {
      countdownEl.innerHTML = '<strong>已截止</strong>';
    }
  }

  update();
  setInterval(update, 60 * 60 * 1000); // 每小时更新
}

// ========== 筛选栏 ==========
function renderFilterBar(comp) {
  const bar = document.getElementById('filter-bar');
  const allSkills = [...new Set(comp.teams.flatMap(t => t.skillsRequired))];

  bar.innerHTML = `
    <span class="tag tag--active" data-filter="all">全部</span>
    ${allSkills.map(skill => `<span class="tag" data-filter="${skill}">${skill}</span>`).join('')}
  `;

  bar.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag');
    if (!tag) return;

    bar.querySelectorAll('.tag').forEach(t => t.classList.remove('tag--active'));
    tag.classList.add('tag--active');

    currentFilter = tag.dataset.filter;
    const filtered = currentFilter === 'all'
      ? allTeams
      : allTeams.filter(t => t.skillsRequired.includes(currentFilter));

    renderTeams(filtered);
  });
}

// ========== 渲染队伍列表 ==========
function renderTeams(teams) {
  const container = document.getElementById('team-list');

  if (teams.length === 0) {
    container.innerHTML = '<p style="color: var(--color-gray-mid); grid-column: 1 / -1;">暂无符合条件的队伍</p>';
    return;
  }

  // 按得分降序排列
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  container.innerHTML = sorted.map(team => `
    <div class="card team-card">
      <span class="team-card__score">${team.score}分</span>
      <div class="card__header">
        <div>
          <div class="team-card__captain">
            <span class="team-card__avatar">${generateAvatar(team.captain)}</span>
            <span>${team.captain}</span>
          </div>
          <h3 class="card__title">${team.title}</h3>
        </div>
      </div>
      <div class="card__body">
        <p>${team.description}</p>
        <div style="margin-top: 12px;">
          ${team.skillsRequired.map(s => `<span class="tag">${s}</span>`).join(' ')}
        </div>
      </div>
      <div class="card__footer">
        <span class="card__meta">${team.currentMembers}/${team.maxMembers} 人 · ${formatDate(team.createdAt)}</span>
        <span class="card__meta">${team.contact}</span>
      </div>
    </div>
  `).join('');
}

init();
```

- [ ] **Step 3: Verify — open match.html, check countdown, filter by skills, team cards sorted by score**

- [ ] **Step 4: Commit**

```bash
git add views/match.html js/match.js
git commit -m "feat: add match detail page with countdown, filter, and team list"
```

---

### Task 10: Post Page — `views/post.html` + `js/post.js`

**Files:**
- Create: `views/post.html`
- Create: `js/post.js`

- [ ] **Step 1: Create views/post.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>发布组队 — 竞赛组队平台</title>
  <link rel="stylesheet" href="../assets/styles/base.css">
  <link rel="stylesheet" href="../assets/styles/components.css">
  <link rel="stylesheet" href="../assets/styles/pages.css">
</head>
<body>
  <main class="site-main">
    <div class="container">
      <div class="post-layout">
        <!-- 左侧：表单 -->
        <div class="post-form-section">
          <h2 class="post-form-section__title">发布组队信息</h2>
          <form id="post-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="teamName">队伍名称 *</label>
              <input type="text" id="teamName" class="form-input" placeholder="2-20 个字符" maxlength="20">
              <div class="form-error" id="teamName-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="skillsRequired">技能要求（逗号分隔）</label>
              <input type="text" id="skillsRequired" class="form-input" placeholder="如：C++, 算法, 团队合作">
            </div>
            <div class="form-group">
              <label class="form-label" for="maxMembers">队伍人数上限 *</label>
              <select id="maxMembers" class="form-select form-input">
                <option value="">请选择</option>
                <option value="2">2 人</option>
                <option value="3">3 人</option>
                <option value="4">4 人</option>
                <option value="5">5 人</option>
                <option value="6">6 人</option>
                <option value="7">7 人</option>
                <option value="8">8 人</option>
                <option value="9">9 人</option>
                <option value="10">10 人</option>
              </select>
              <div class="form-error" id="maxMembers-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="description">队伍描述 *</label>
              <textarea id="description" class="form-textarea" placeholder="10-500 字，描述你的队伍情况和期望的队友..." maxlength="500"></textarea>
              <div class="form-error" id="description-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="contact">联系方式 *</label>
              <input type="text" id="contact" class="form-input" placeholder="格式：微信: your_id 或 QQ: 123456">
              <div class="form-error" id="contact-error"></div>
            </div>
            <button type="submit" class="btn btn--block">发布组队信息</button>
          </form>
        </div>

        <!-- 右侧：预览 + 得分 -->
        <div class="post-preview-section">
          <div class="preview-card">
            <h3 class="preview-card__title">实时预览</h3>
            <div id="preview-content">
              <p style="color: var(--color-gray-mid); font-size: 0.875rem;">填写左侧表单，这里会实时预览你的组队卡片。</p>
            </div>
          </div>
          <div class="score-display">
            <div class="score-display__number" id="score-number">0</div>
            <div class="score-display__label">组队吸引力得分</div>
            <div class="score-bar" style="margin-top: 12px;">
              <div class="score-bar__fill" id="score-bar-fill" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- 提交成功弹窗 -->
  <div id="success-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; display:none; align-items:center; justify-content:center;">
    <div style="background:var(--color-white); border:var(--border-heavy); box-shadow:var(--shadow-pop); padding:var(--space-xl); max-width:400px; width:90%; text-align:center;">
      <h3 style="margin-bottom:var(--space-md);">发布成功！</h3>
      <p style="color:var(--color-gray-dark); margin-bottom:var(--space-lg);">你的组队信息已提交。</p>
      <button class="btn" id="modal-close-btn">确定</button>
    </div>
  </div>

  <script type="module" src="../js/post.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create js/post.js**

```javascript
// js/post.js
// 发布页入口模块 — 表单校验 + 实时得分计算 + 预览

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { $, debounce, generateAvatar } from '../components/utils.js';
import { validateForm } from '../components/validator.js';
import { calculateScore } from '../components/scoreCalculator.js';

renderHeader('post');
renderFooter();

const form = $('#post-form');
const previewContent = $('#preview-content');
const scoreNumber = $('#score-number');
const scoreBarFill = $('#score-bar-fill');
const successModal = $('#success-modal');
const modalCloseBtn = $('#modal-close-btn');

// ========== 收集表单数据 ==========
function collectFormData() {
  return {
    teamName: $('#teamName').value,
    skillsRequired: $('#skillsRequired').value
      .split(/[,，、]/)
      .map(s => s.trim())
      .filter(Boolean),
    maxMembers: $('#maxMembers').value,
    description: $('#description').value,
    contact: $('#contact').value
  };
}

// ========== 实时更新预览和得分 ==========
const updatePreview = debounce(() => {
  const data = collectFormData();

  // 更新预览卡片
  const hasContent = data.teamName || data.description;
  if (!hasContent) {
    previewContent.innerHTML = '<p style="color: var(--color-gray-mid); font-size: 0.875rem;">填写左侧表单，这里会实时预览你的组队卡片。</p>';
  } else {
    previewContent.innerHTML = `
      <div class="card" style="box-shadow: none; border: var(--border-thick);">
        <div class="team-card__captain" style="margin-bottom: 8px;">
          <span class="team-card__avatar">${generateAvatar('我')}</span>
          <span>我</span>
        </div>
        <h4 class="card__title">${data.teamName || '未填写队伍名称'}</h4>
        <p style="font-size: 0.875rem; color: var(--color-gray-dark); margin: 8px 0;">${data.description ? data.description.slice(0, 100) + (data.description.length > 100 ? '...' : '') : '未填写描述'}</p>
        <div style="margin: 8px 0;">${data.skillsRequired.map(s => `<span class="tag">${s}</span>`).join(' ')}</div>
        <div class="card__footer">
          <span class="card__meta">${data.maxMembers ? `0/${data.maxMembers} 人` : '未设置人数'}</span>
          <span class="card__meta">${data.contact || '未填写联系方式'}</span>
        </div>
      </div>
    `;
  }

  // 更新得分
  const score = calculateScore(data);
  scoreNumber.textContent = score;
  scoreBarFill.style.width = `${score}%`;
}, 200);

// 监听所有表单输入
form.addEventListener('input', updatePreview);

// ========== 表单校验 + 提交 ==========
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = collectFormData();
  const { valid, errors } = validateForm(data);

  // 清除之前的错误
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

  if (!valid) {
    // 显示错误
    for (const [field, message] of Object.entries(errors)) {
      const errorEl = $(`#${field}-error`);
      const inputEl = $(`#${field}`);
      if (errorEl) errorEl.textContent = message;
      if (inputEl) inputEl.classList.add('error');
    }
    return;
  }

  // 显示成功弹窗
  successModal.style.display = 'flex';
});

// 关闭弹窗
modalCloseBtn.addEventListener('click', () => {
  successModal.style.display = 'none';
  form.reset();
  updatePreview();
});

successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.style.display = 'none';
  }
});
```

- [ ] **Step 3: Verify — open post.html, test real-time score update, form validation errors, submission modal**

- [ ] **Step 4: Commit**

```bash
git add views/post.html js/post.js
git commit -m "feat: add post page with form validation, real-time score, and preview"
```

---

### Task 11: Community Page — `views/community.html` + `js/community.js`

**Files:**
- Create: `views/community.html`
- Create: `js/community.js`

- [ ] **Step 1: Create views/community.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>社区 — 竞赛组队平台</title>
  <link rel="stylesheet" href="../assets/styles/base.css">
  <link rel="stylesheet" href="../assets/styles/components.css">
  <link rel="stylesheet" href="../assets/styles/pages.css">
</head>
<body>
  <main class="site-main">
    <!-- 社区头部 -->
    <section class="community-header">
      <div class="container">
        <h1>竞赛社区</h1>
        <p style="color: var(--color-gray-mid); margin-top: 8px;">组队招募 · 经验分享 · 问题求助</p>
        <div class="community-tabs" id="community-tabs">
          <span class="tag active" data-category="all">全部</span>
          <span class="tag" data-category="组队招募">组队招募</span>
          <span class="tag" data-category="经验分享">经验分享</span>
          <span class="tag" data-category="问题求助">问题求助</span>
        </div>
      </div>
    </section>

    <!-- 帖子列表 -->
    <section class="community-content">
      <div class="container">
        <div id="posts-list">
          <!-- JS 动态渲染 -->
        </div>
      </div>
    </section>
  </main>

  <script type="module" src="../js/community.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create js/community.js**

```javascript
// js/community.js
// 社区页入口模块 — 帖子列表 + 多级评论 + 分类过滤

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { fetchJSON, formatDate, generateAvatar } from '../components/utils.js';
import { renderComments, bindCommentEvents } from '../components/comments.js';

renderHeader('community');
renderFooter();

let allPosts = [];
let currentCategory = 'all';

// ========== 初始化 ==========
async function init() {
  const data = await fetchJSON('../public/data/community.json');
  allPosts = data.posts;
  renderPosts(allPosts);
  bindCategoryTabs();
}

// ========== 分类过滤 ==========
function bindCategoryTabs() {
  const tabs = document.getElementById('community-tabs');
  tabs.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag');
    if (!tag) return;

    tabs.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    currentCategory = tag.dataset.category;
    const filtered = currentCategory === 'all'
      ? allPosts
      : allPosts.filter(p => p.category === currentCategory);

    renderPosts(filtered);
  });
}

// ========== 渲染帖子列表 ==========
function renderPosts(posts) {
  const container = document.getElementById('posts-list');

  if (posts.length === 0) {
    container.innerHTML = '<p style="color: var(--color-gray-mid); text-align: center; padding: 48px 0;">暂无帖子</p>';
    return;
  }

  container.innerHTML = posts.map(post => {
    const commentsHTML = renderComments(post.comments);
    const totalComments = countComments(post.comments);

    return `
      <div class="card post-card" data-post-id="${post.id}">
        <div class="card__header">
          <div class="post-card__author">
            <span class="post-card__avatar">${generateAvatar(post.author)}</span>
            <span>${post.author}</span>
          </div>
          <span class="card__badge">${post.category}</span>
        </div>
        <h3 class="card__title" style="margin-bottom: 8px;">${post.title}</h3>
        <div class="card__body">${post.content}</div>
        <div class="post-card__actions">
          <button class="like-btn" data-post-id="${post.id}">
            👍 ${post.likes}
          </button>
          <button class="comment-toggle-btn" data-post-id="${post.id}">
            💬 ${totalComments} 条评论
          </button>
          <span class="card__meta" style="margin-left: auto;">${formatDate(post.createdAt)}</span>
        </div>
        <div class="comments-section" id="comments-${post.id}" style="display: none;">
          <h4 class="comments-section__title">评论 (${totalComments})</h4>
          <div class="comments-list" data-post-id="${post.id}">
            ${commentsHTML}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 绑定事件
  bindPostEvents();
}

// ========== 统计评论数（递归） ==========
function countComments(comments) {
  if (!comments) return 0;
  return comments.reduce((sum, c) => {
    return sum + 1 + countComments(c.replies);
  }, 0);
}

// ========== 绑定帖子事件 ==========
function bindPostEvents() {
  const container = document.getElementById('posts-list');

  // 点赞
  container.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      const postId = parseInt(likeBtn.dataset.postId);
      const post = allPosts.find(p => p.id === postId);
      if (post) {
        post.likes += 1;
        likeBtn.classList.toggle('liked');
        likeBtn.textContent = `👍 ${post.likes}`;
      }
      return;
    }

    // 展开/收起评论
    const toggleBtn = e.target.closest('.comment-toggle-btn');
    if (toggleBtn) {
      const postId = toggleBtn.dataset.postId;
      const commentsSection = document.getElementById(`comments-${postId}`);
      if (commentsSection) {
        const isVisible = commentsSection.style.display !== 'none';
        commentsSection.style.display = isVisible ? 'none' : 'block';
      }
    }
  });

  // 评论回复事件委托
  container.querySelectorAll('.comments-list').forEach(list => {
    const postId = parseInt(list.dataset.postId);
    bindCommentEvents(list, (parentId, content) => {
      const post = allPosts.find(p => p.id === postId);
      if (!post) return;

      // 找到父评论并添加回复
      const reply = {
        id: Date.now(),
        author: '匿名用户',
        content,
        createdAt: new Date().toISOString().split('T')[0],
        replies: []
      };

      const added = addReplyToComment(post.comments, parseInt(parentId), reply);
      if (added) {
        // 重新渲染该帖子的评论区
        const commentsList = document.querySelector(`.comments-list[data-post-id="${postId}"]`);
        if (commentsList) {
          commentsList.innerHTML = renderComments(post.comments);
          bindCommentEvents(commentsList, arguments.callee);
        }
        // 更新评论数
        const total = countComments(post.comments);
        const sectionTitle = document.querySelector(`#comments-${postId} .comments-section__title`);
        if (sectionTitle) sectionTitle.textContent = `评论 (${total})`;
      }
    });
  });
}

// ========== 递归查找并添加回复 ==========
function addReplyToComment(comments, parentId, reply) {
  for (const comment of comments) {
    if (comment.id === parentId) {
      if (!comment.replies) comment.replies = [];
      comment.replies.push(reply);
      return true;
    }
    if (comment.replies && comment.replies.length > 0) {
      const found = addReplyToComment(comment.replies, parentId, reply);
      if (found) return true;
    }
  }
  return false;
}

init();
```

- [ ] **Step 3: Verify — open community.html, test category filter, expand comments, add replies**

- [ ] **Step 4: Commit**

```bash
git add views/community.html js/community.js
git commit -m "feat: add community page with posts, multi-level comments, and category filter"
```

---

### Task 12: Profile Page — `views/profile.html` + `js/profile.js`

**Files:**
- Create: `views/profile.html`
- Create: `js/profile.js`

- [ ] **Step 1: Create views/profile.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个人中心 — 竞赛组队平台</title>
  <link rel="stylesheet" href="../assets/styles/base.css">
  <link rel="stylesheet" href="../assets/styles/components.css">
  <link rel="stylesheet" href="../assets/styles/pages.css">
</head>
<body>
  <main class="site-main">
    <div class="container">
      <div class="profile-layout">
        <!-- 左侧：编辑表单 -->
        <div class="profile-form-section">
          <h2 class="profile-form-section__title">个人简历编辑</h2>
          <form id="profile-form">
            <div class="form-group">
              <label class="form-label" for="name">姓名</label>
              <input type="text" id="name" class="form-input" placeholder="你的姓名">
            </div>
            <div class="form-group">
              <label class="form-label" for="school">学校</label>
              <input type="text" id="school" class="form-input" placeholder="所在学校">
            </div>
            <div class="form-group">
              <label class="form-label" for="major">专业</label>
              <input type="text" id="major" class="form-input" placeholder="所学专业">
            </div>
            <div class="form-group">
              <label class="form-label" for="grade">年级</label>
              <select id="grade" class="form-select form-input">
                <option value="">请选择年级</option>
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三">大三</option>
                <option value="大四">大四</option>
                <option value="研一">研一</option>
                <option value="研二">研二</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="skills">技能（逗号分隔）</label>
              <input type="text" id="skills" class="form-input" placeholder="如：C++, Python, Figma">
            </div>
            <div class="form-group">
              <label class="form-label" for="competitions">竞赛经历</label>
              <textarea id="competitions" class="form-textarea" placeholder="描述你参加过的竞赛及成绩..." style="min-height: 80px;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="achievements">荣誉成就</label>
              <textarea id="achievements" class="form-textarea" placeholder="获得的奖项、证书等..." style="min-height: 80px;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" for="contact">联系方式</label>
              <input type="text" id="contact" class="form-input" placeholder="微信/QQ/邮箱">
            </div>
            <div class="form-group">
              <label class="form-label" for="bio">个人简介</label>
              <textarea id="bio" class="form-textarea" placeholder="简单介绍一下自己..." style="min-height: 80px;"></textarea>
            </div>
          </form>
          <div class="profile-actions">
            <button class="btn" id="save-btn">保存简历</button>
            <button class="btn btn--outline" id="export-btn">导出 JSON</button>
            <button class="btn btn--outline" id="clear-btn">清空重置</button>
          </div>
        </div>

        <!-- 右侧：简历预览 -->
        <div class="profile-preview-section">
          <div class="resume-card" id="resume-preview">
            <div class="resume-card__header">
              <h2 class="resume-card__name" id="resume-name">未填写姓名</h2>
              <p class="resume-card__school" id="resume-school">未填写学校</p>
            </div>
            <div class="resume-card__section">
              <h4 class="resume-card__section-title">基本信息</h4>
              <p id="resume-basic">专业：未填写 | 年级：未填写</p>
            </div>
            <div class="resume-card__section">
              <h4 class="resume-card__section-title">技能特长</h4>
              <div class="resume-card__skills" id="resume-skills">
                <span class="tag">未填写</span>
              </div>
            </div>
            <div class="resume-card__section">
              <h4 class="resume-card__section-title">竞赛经历</h4>
              <p id="resume-competitions" style="font-size: 0.9375rem;">未填写</p>
            </div>
            <div class="resume-card__section">
              <h4 class="resume-card__section-title">荣誉成就</h4>
              <p id="resume-achievements" style="font-size: 0.9375rem;">未填写</p>
            </div>
            <div class="resume-card__section">
              <h4 class="resume-card__section-title">联系方式</h4>
              <p id="resume-contact" style="font-size: 0.9375rem;">未填写</p>
            </div>
            <div class="resume-card__section">
              <h4 class="resume-card__section-title">个人简介</h4>
              <p id="resume-bio" style="font-size: 0.9375rem;">未填写</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script type="module" src="../js/profile.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create js/profile.js**

```javascript
// js/profile.js
// 个人页入口模块 — 简历编辑 + localStorage 持久化 + 实时预览

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { $, debounce } from '../components/utils.js';
import { loadProfile, saveProfile, clearProfile } from '../components/storage.js';

renderHeader('profile');
renderFooter();

const form = $('#profile-form');
const saveBtn = $('#save-btn');
const exportBtn = $('#export-btn');
const clearBtn = $('#clear-btn');

const fields = ['name', 'school', 'major', 'grade', 'skills', 'competitions', 'achievements', 'contact', 'bio'];

// ========== 加载已保存的简历 ==========
function loadSavedProfile() {
  const profile = loadProfile();
  for (const field of fields) {
    const el = $(`#${field}`);
    if (el) {
      el.value = Array.isArray(profile[field]) ? profile[field].join(', ') : (profile[field] || '');
    }
  }
  updatePreview();
}

// ========== 收集表单数据 ==========
function collectFormData() {
  const data = {};
  for (const field of fields) {
    const el = $(`#${field}`);
    if (el) {
      const val = el.value.trim();
      if (field === 'skills') {
        data[field] = val ? val.split(/[,，、]/).map(s => s.trim()).filter(Boolean) : [];
      } else {
        data[field] = val;
      }
    }
  }
  return data;
}

// ========== 实时更新简历预览 ==========
const updatePreview = debounce(() => {
  const data = collectFormData();

  $('#resume-name').textContent = data.name || '未填写姓名';
  $('#resume-school').textContent = data.school || '未填写学校';
  $('#resume-basic').textContent = `专业：${data.major || '未填写'} | 年级：${data.grade || '未填写'}`;

  // 技能标签
  const skillsEl = $('#resume-skills');
  if (data.skills.length > 0) {
    skillsEl.innerHTML = data.skills.map(s => `<span class="tag">${s}</span>`).join('');
  } else {
    skillsEl.innerHTML = '<span class="tag">未填写</span>';
  }

  $('#resume-competitions').textContent = data.competitions || '未填写';
  $('#resume-achievements').textContent = data.achievements || '未填写';
  $('#resume-contact').textContent = data.contact || '未填写';
  $('#resume-bio').textContent = data.bio || '未填写';
}, 200);

// 监听所有表单输入
form.addEventListener('input', updatePreview);

// ========== 保存简历 ==========
saveBtn.addEventListener('click', () => {
  const data = collectFormData();
  saveProfile(data);
  saveBtn.textContent = '已保存 ✓';
  setTimeout(() => { saveBtn.textContent = '保存简历'; }, 2000);
});

// ========== 导出 JSON ==========
exportBtn.addEventListener('click', () => {
  const data = collectFormData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume_${data.name || 'unnamed'}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// ========== 清空重置 ==========
clearBtn.addEventListener('click', () => {
  if (confirm('确定要清空所有简历数据吗？此操作不可撤销。')) {
    clearProfile();
    form.reset();
    updatePreview();
  }
});

// 初始化
loadSavedProfile();
```

- [ ] **Step 3: Verify — open profile.html, fill form, check real-time preview, save to localStorage, refresh to confirm persistence, test export and clear**

- [ ] **Step 4: Commit**

```bash
git add views/profile.html js/profile.js
git commit -m "feat: add profile page with resume editor, localStorage persistence, and export"
```

---

### Task 13: Final Verification & Cleanup

- [ ] **Step 1: Verify all 5 pages load correctly in browser**

Open each page and check:
- `index.html` — Swiper auto-plays, ECharts pie chart renders, team cards load via Fetch
- `views/match.html` — Countdown works, filter by skills, teams sorted by score
- `views/post.html` — Real-time score updates, form validation catches errors, modal works
- `views/community.html` — Posts load, category filter works, comments expand, replies work
- `views/profile.html` — Form auto-saves to localStorage, preview updates live, export works

- [ ] **Step 2: Verify all 7 technical requirements are covered**

| Requirement | Verification |
|-------------|-------------|
| ES6+ syntax | Check template literals, arrow functions, destructuring, `.map()/.filter()/.flatMap()` in all JS files |
| DOM interaction | Community comments, match page filter, post page preview |
| Form validation | Post page catches invalid inputs, profile page validates |
| localStorage | Profile page saves/loads/clears |
| Fetch API | Index and match pages load JSON, community page loads JSON |
| ECharts | Index page pie chart |
| Swiper | Index page carousel |

- [ ] **Step 3: Clean up any unused files, verify file structure matches spec**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```
