// js/community.js
// 社区页入口模块 — 帖子列表 + 多级评论 + 分类过滤 + localStorage 合并

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { fetchJSON, formatDate, generateAvatar } from '../components/utils.js';
import { renderComments, bindCommentEvents } from '../components/comments.js';
import { mergePostsWithJson, loadUserPosts, saveUserPosts } from '../components/storage.js';

renderHeader('community');
renderFooter();

let allPosts = [];
let currentCategory = 'all';

// ========== 初始化 ==========
async function init() {
  const data = await fetchJSON('../public/data/community.json');
  // 合并 JSON 演示数据 + localStorage 用户帖子
  allPosts = mergePostsWithJson(data.posts);
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
    container.innerHTML = '<p style="color: var(--color-gray-mid); text-align: center; padding: 48px 0; text-transform: none;">暂无帖子</p>';
    return;
  }

  container.innerHTML = posts.map(post => {
    const commentsHTML = renderComments(post.comments);
    const totalComments = countComments(post.comments);
    const authorName = post.author || '匿名用户';

    return `
      <div class="card post-card" data-post-id="${post.id}">
        <div class="card__header">
          <div class="post-card__author">
            <span class="post-card__avatar">${generateAvatar(authorName)}</span>
            <span>${authorName}</span>
          </div>
          <span class="card__badge">${post.category}</span>
        </div>
        <h3 class="card__title" style="margin-bottom: 8px;">${post.title}</h3>
        <div class="card__body" style="text-transform: none;">${post.content}</div>
        <div class="post-card__actions">
          <button class="like-btn" data-post-id="${post.id}">
            👍 ${post.likes || 0}
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
        if (!post.likes) post.likes = 0;
        post.likes += 1;
        likeBtn.classList.toggle('liked');
        likeBtn.textContent = `👍 ${post.likes}`;

        // 如果是用户帖子，同步到 localStorage
        const userPosts = loadUserPosts();
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
          userPost.likes = post.likes;
          saveUserPosts(userPosts);
        }
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

      const reply = {
        id: Date.now(),
        author: '匿名用户',
        content,
        createdAt: new Date().toISOString().split('T')[0],
        replies: []
      };

      const added = addReplyToComment(post.comments, parseInt(parentId), reply);
      if (added) {
        // 如果是用户帖子，同步到 localStorage
        const userPosts = loadUserPosts();
        const userPost = userPosts.find(p => p.id === postId);
        if (userPost) {
          userPost.comments = post.comments;
          saveUserPosts(userPosts);
        }

        const commentsList = document.querySelector(`.comments-list[data-post-id="${postId}"]`);
        if (commentsList) {
          commentsList.innerHTML = renderComments(post.comments);
          bindCommentEvents(list, () => {});
        }
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
