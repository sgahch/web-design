// components/header.js
// 页眉组件 — 动态注入导航栏

import { $ } from './utils.js';

const NAV_ITEMS = [
  { href: 'index.html', label: '首页', page: 'index' },
  { href: 'views/match.html', label: '竞赛详情', page: 'match' },
  { href: 'views/post.html', label: '发布组队/帖子', page: 'post' },
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
