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
