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
 * 生成 SVG 头像（纯色方块 + 首字母），可点击跳转个人中心
 * @param {string} name 姓名
 * @param {boolean} [linkable=true] 是否包裹链接
 * @returns {string} 内联 SVG 字符串（或包裹在 <a> 中）
 */
export function generateAvatar(name, linkable = true) {
  const initial = name.charAt(0);
  const svg = `<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" fill="#0a0a0a"/>
    <text x="18" y="24" text-anchor="middle" fill="#FFD600" font-size="18" font-weight="900" font-family="system-ui">${initial}</text>
  </svg>`;
  if (linkable) {
    return `<a href="${getProfileLink(name)}" class="avatar-link" title="查看${name}的简历">${svg}</a>`;
  }
  return svg;
}

/**
 * 获取个人中心页面链接
 * @param {string} name 姓名
 * @returns {string} profile.html 的相对路径（含 user 参数）
 */
export function getProfileLink(name) {
  const isSubPage = !window.location.pathname.endsWith('index.html') &&
    !window.location.pathname.endsWith('/');
  const prefix = isSubPage ? '' : 'views/';
  return `${prefix}profile.html?user=${encodeURIComponent(name)}`;
}

/**
 * 判断是否是当前登录用户
 * @param {string} name 要判断的姓名
 * @returns {boolean}
 */
export function isCurrentUser(name) {
  try {
    const raw = localStorage.getItem('competition_platform_profile');
    if (raw) {
      const profile = JSON.parse(raw);
      return profile.name && profile.name === name;
    }
  } catch (e) {}
  return false;
}

/**
 * 生成随机 ID
 * @returns {number}
 */
export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
