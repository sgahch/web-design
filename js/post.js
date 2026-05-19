// js/post.js
// 发布页入口模块 — 组队招募 / 经验分享 / 问题求助

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { $, debounce, generateAvatar, fetchJSON } from '../components/utils.js';
import { validateForm } from '../components/validator.js';
import { calculateScore } from '../components/scoreCalculator.js';
import { addPost, addTeamToCompetition, loadProfile } from '../components/storage.js';

renderHeader('post');
renderFooter();

const form = $('#post-form');
const previewContent = $('#preview-content');
const scoreNumber = $('#score-number');
const scoreBarFill = $('#score-bar-fill');
const successModal = $('#success-modal');
const modalCloseBtn = $('#modal-close-btn');
const submitBtn = $('#submit-btn');
const scoreSection = $('#score-section');

let postType = 'team'; // 'team' | 'experience' | 'help'
let allCompetitions = [];

// ========== 初始化：加载竞赛列表 ==========
async function init() {
  const data = await fetchJSON('../public/data/competitions.json');
  allCompetitions = data.competitions;

  const select = $('#competitionId');
  allCompetitions.forEach(comp => {
    const opt = document.createElement('option');
    opt.value = comp.id;
    opt.textContent = comp.title;
    select.appendChild(opt);
  });
}

init();

// ========== 帖子类型切换 ==========
const typeTabs = $('#post-type-tabs');
typeTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.post-type-tab');
  if (!tab) return;

  typeTabs.querySelectorAll('.post-type-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  postType = tab.dataset.type;
  toggleFormFields();
  updatePreview();
});

// ========== 根据类型切换表单字段 ==========
function toggleFormFields() {
  const isTeam = postType === 'team';

  $('#competition-group').style.display = isTeam ? 'block' : 'none';
  $('#teamName-group').style.display = isTeam ? 'block' : 'none';
  $('#skillsRequired-group').style.display = isTeam ? 'block' : 'none';
  $('#maxMembers-group').style.display = isTeam ? 'block' : 'none';
  $('#contact-group').style.display = isTeam ? 'block' : 'none';
  $('#title-group').style.display = isTeam ? 'none' : 'block';
  scoreSection.style.display = isTeam ? 'block' : 'none';

  submitBtn.textContent = isTeam ? '发布组队信息' : '发布帖子';
}

// ========== 收集表单数据 ==========
function collectFormData() {
  const profile = loadProfile();
  const data = {
    type: postType,
    author: profile.name || '匿名用户',
    competitionId: parseInt($('#competitionId').value) || 0,
    teamName: $('#teamName').value,
    title: $('#postTitle').value,
    skillsRequired: $('#skillsRequired').value
      .split(/[,，、]/)
      .map(s => s.trim())
      .filter(Boolean),
    maxMembers: $('#maxMembers').value,
    description: $('#description').value,
    contact: $('#contact').value
  };
  return data;
}

// ========== 实时更新预览和得分 ==========
const updatePreview = debounce(() => {
  const data = collectFormData();

  if (postType === 'team') {
    // 组队招募预览
    const hasContent = data.teamName || data.description;
    if (!hasContent) {
      previewContent.innerHTML = '<p style="color: var(--color-gray-mid); font-size: 0.875rem; text-transform: none;">填写左侧表单，这里会实时预览你的组队卡片。</p>';
    } else {
      const compName = allCompetitions.find(c => c.id === data.competitionId)?.title || '未选择竞赛';
      previewContent.innerHTML = `
        <div class="card" style="box-shadow: none; border: var(--border-thick);">
          <div class="card__header">
            <div class="team-card__captain" style="margin-bottom: 8px;">
              <span class="team-card__avatar">${generateAvatar(data.author || '我', false)}</span>
              <span>${data.author || '我'}</span>
            </div>
            <span class="card__badge">组队招募</span>
          </div>
          <h4 class="card__title">${data.teamName || '未填写队伍名称'}</h4>
          <p style="font-size: 0.75rem; color: var(--color-gray-mid); margin: 4px 0;">${compName}</p>
          <p style="font-size: 0.875rem; color: var(--color-gray-dark); margin: 8px 0; text-transform: none;">${data.description ? data.description.slice(0, 100) + (data.description.length > 100 ? '...' : '') : '未填写描述'}</p>
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
  } else {
    // 经验分享/问题求助预览
    const hasContent = data.title || data.description;
    if (!hasContent) {
      previewContent.innerHTML = '<p style="color: var(--color-gray-mid); font-size: 0.875rem; text-transform: none;">填写左侧表单，这里会实时预览你的帖子。</p>';
    } else {
      const categoryLabel = postType === 'experience' ? '经验分享' : '问题求助';
      previewContent.innerHTML = `
        <div class="card" style="box-shadow: none; border: var(--border-thick);">
          <div class="card__header">
            <div class="post-card__author">
              <span class="post-card__avatar">${generateAvatar(data.author || '我', false)}</span>
              <span>${data.author || '我'}</span>
            </div>
            <span class="card__badge">${categoryLabel}</span>
          </div>
          <h4 class="card__title" style="margin-bottom: 8px;">${data.title || '未填写标题'}</h4>
          <div class="card__body" style="text-transform: none;">${data.description ? data.description.slice(0, 150) + (data.description.length > 150 ? '...' : '') : '未填写内容'}</div>
        </div>
      `;
    }
  }
}, 200);

// 监听所有表单输入
form.addEventListener('input', updatePreview);

// ========== 表单校验 + 提交 ==========
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = collectFormData();

  // 根据类型选择校验规则
  let rules;
  if (postType === 'team') {
    rules = {
      teamName: { pattern: /^.{2,20}$/, message: '队伍名称需要 2-20 个字符' },
      contact: { pattern: /^(微信|QQ|邮箱|手机)\s*[:：]\s*.+/, message: '请按格式填写，如：微信: your_id' },
      maxMembers: { pattern: /^([2-9]|10)$/, message: '队伍人数需在 2-10 人之间' },
      description: { validator: (v) => v.length >= 10 && v.length <= 500, message: '描述需要 10-500 个字符' }
    };
  } else {
    rules = {
      title: { pattern: /^.{2,50}$/, message: '标题需要 2-50 个字符' },
      description: { validator: (v) => v.length >= 10 && v.length <= 500, message: '内容需要 10-500 个字符' }
    };
  }

  const { valid, errors } = validateForm(data, rules);

  // 清除之前的错误
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

  if (!valid) {
    for (const [field, message] of Object.entries(errors)) {
      const errorEl = $(`#${field}-error`);
      const inputEl = $(`#${field}`);
      if (errorEl) errorEl.textContent = message;
      if (inputEl) inputEl.classList.add('error');
    }
    return;
  }

  // 保存到 localStorage
  if (postType === 'team') {
    addTeamToCompetition(data.competitionId, {
      captain: data.author,
      title: data.teamName,
      description: data.description,
      skillsRequired: data.skillsRequired,
      currentMembers: 1,
      maxMembers: parseInt(data.maxMembers),
      contact: data.contact,
      score: calculateScore(data)
    });
  } else {
    addPost({
      type: postType,
      author: data.author,
      title: data.title,
      content: data.description,
      category: postType === 'experience' ? '经验分享' : '问题求助'
    });
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
