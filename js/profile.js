// js/profile.js
// 个人页入口模块 — 简历编辑 + localStorage 持久化 + 实时预览 + 用户查看

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { $, debounce, generateAvatar } from '../components/utils.js';
import { loadProfile, saveProfile, clearProfile } from '../components/storage.js';

renderHeader('profile');
renderFooter();

const fields = ['name', 'school', 'major', 'grade', 'skills', 'competitions', 'achievements', 'contact', 'bio'];

// ========== 初始化：判断模式 ==========
function init() {
  const params = new URLSearchParams(window.location.search);
  const userName = params.get('user');

  if (!userName) {
    // 无参数 → 当前用户编辑模式
    showEditMode();
    return;
  }

  // 检查是否是当前用户
  const profile = loadProfile();
  if (profile.name && profile.name === decodeURIComponent(userName)) {
    showEditMode();
  } else {
    showViewMode(decodeURIComponent(userName));
  }
}

// ========== 编辑模式（当前用户） ==========
function showEditMode() {
  document.getElementById('edit-mode').style.display = 'block';
  document.getElementById('view-mode').style.display = 'none';
  document.title = '个人中心 — 竞赛组队平台';

  const form = $('#profile-form');
  const saveBtn = $('#save-btn');
  const exportBtn = $('#export-btn');
  const clearBtn = $('#clear-btn');

  // 加载已保存的简历
  loadSavedProfile();

  // 监听所有表单输入
  form.addEventListener('input', updatePreview);

  // 保存简历
  saveBtn.addEventListener('click', () => {
    const data = collectFormData();
    saveProfile(data);
    saveBtn.textContent = '已保存 ✓';
    setTimeout(() => { saveBtn.textContent = '保存简历'; }, 2000);
  });

  // 导出 JSON
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

  // 清空重置
  clearBtn.addEventListener('click', () => {
    if (confirm('确定要清空所有简历数据吗？此操作不可撤销。')) {
      clearProfile();
      form.reset();
      updatePreview();
    }
  });
}

// ========== 查看模式（其他用户） ==========
function showViewMode(userName) {
  document.getElementById('edit-mode').style.display = 'none';
  document.getElementById('view-mode').style.display = 'block';
  document.title = `${userName} 的简历 — 竞赛组队平台`;

  // 生成头像
  document.getElementById('view-avatar').innerHTML = generateAvatar(userName, false);
  document.getElementById('view-name').textContent = userName;

  // 尝试从 localStorage 查找该用户数据
  // 由于 localStorage 只存当前用户，其他用户显示占位数据
  const profile = loadProfile();
  if (profile.name === userName) {
    // 当前用户的数据显示完整简历
    fillViewMode(profile);
  } else {
    // 其他用户显示占位信息
    document.getElementById('view-school').textContent = '该用户暂未完善简历';
    document.getElementById('view-basic').textContent = '暂无信息';
    document.getElementById('view-skills').innerHTML = '<span class="tag">暂无</span>';
    document.getElementById('view-competitions').textContent = '暂无信息';
    document.getElementById('view-achievements').textContent = '暂无信息';
    document.getElementById('view-contact').textContent = '暂无信息';
    document.getElementById('view-bio').textContent = '该用户暂未完善个人简历，无法查看详细信息。';
  }
}

// ========== 填充查看模式数据 ==========
function fillViewMode(profile) {
  document.getElementById('view-school').textContent = profile.school || '未填写学校';
  document.getElementById('view-basic').textContent = `专业：${profile.major || '未填写'} | 年级：${profile.grade || '未填写'}`;

  const skills = profile.skills || [];
  const skillsEl = document.getElementById('view-skills');
  if (skills.length > 0) {
    skillsEl.innerHTML = skills.map(s => `<span class="tag">${s}</span>`).join('');
  } else {
    skillsEl.innerHTML = '<span class="tag">未填写</span>';
  }

  document.getElementById('view-competitions').textContent = profile.competitions || '未填写';
  document.getElementById('view-achievements').textContent = profile.achievements || '未填写';
  document.getElementById('view-contact').textContent = profile.contact || '未填写';
  document.getElementById('view-bio').textContent = profile.bio || '未填写';
}

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

init();
