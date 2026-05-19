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
