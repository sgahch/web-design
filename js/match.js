// js/match.js
// 找队友页入口模块 — 竞赛筛选 + 组队列表 + 技能过滤

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { fetchJSON, daysUntil, formatDate, generateAvatar } from '../components/utils.js';
import { getTeamsForCompetition } from '../components/storage.js';

renderHeader('match');
renderFooter();

let allCompetitions = [];
let currentCompetition = null;
let currentTeams = [];
let currentSkillFilter = 'all';

// ========== 初始化 ==========
async function init() {
  const data = await fetchJSON('../public/data/competitions.json');
  allCompetitions = data.competitions;

  // 从 URL 获取竞赛 ID，或默认选第一个
  const params = new URLSearchParams(window.location.search);
  const compId = parseInt(params.get('id')) || 1;
  currentCompetition = allCompetitions.find(c => c.id === compId) || allCompetitions[0];

  renderCompetitionFilter(allCompetitions);
  switchCompetition(currentCompetition);
}

// ========== 竞赛筛选栏 ==========
function renderCompetitionFilter(competitions) {
  const bar = document.getElementById('competition-filter');
  bar.innerHTML = competitions.map(comp => `
    <span class="comp-filter-tag${comp.id === currentCompetition.id ? ' active' : ''}" data-id="${comp.id}">
      ${comp.title}
    </span>
  `).join('');

  bar.addEventListener('click', (e) => {
    const tag = e.target.closest('.comp-filter-tag');
    if (!tag) return;

    bar.querySelectorAll('.comp-filter-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    const compId = parseInt(tag.dataset.id);
    const comp = allCompetitions.find(c => c.id === compId);
    if (comp) {
      currentCompetition = comp;
      switchCompetition(comp);
      // 更新 URL（不刷新页面）
      const url = new URL(window.location);
      url.searchParams.set('id', comp.id);
      window.history.replaceState({}, '', url);
    }
  });
}

// ========== 切换竞赛 ==========
function switchCompetition(comp) {
  renderHero(comp);
  startCountdown(comp.deadline);
  // 合并 JSON 中的 teams 和 localStorage 中的组队招募帖子
  currentTeams = getTeamsForCompetition(comp.teams, comp.id);
  renderSkillFilter(currentTeams);
  currentSkillFilter = 'all';
  renderTeams(currentTeams);

  // 更新组队区域标题
  document.getElementById('team-section-title').textContent =
    `${comp.title} — 组队招募`;
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
  setInterval(update, 60 * 60 * 1000);
}

// ========== 技能筛选栏 ==========
function renderSkillFilter(teams) {
  const bar = document.getElementById('skill-filter-bar');
  const allSkills = [...new Set(teams.flatMap(t => t.skillsRequired))];

  bar.innerHTML = `
    <span class="tag tag--active" data-filter="all">全部</span>
    ${allSkills.map(skill => `<span class="tag" data-filter="${skill}">${skill}</span>`).join('')}
  `;

  // 移除旧监听器（通过替换元素）
  const newBar = bar.cloneNode(true);
  bar.parentNode.replaceChild(newBar, bar);

  newBar.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag');
    if (!tag) return;

    newBar.querySelectorAll('.tag').forEach(t => t.classList.remove('tag--active'));
    tag.classList.add('tag--active');

    currentSkillFilter = tag.dataset.filter;
    const filtered = currentSkillFilter === 'all'
      ? currentTeams
      : currentTeams.filter(t => t.skillsRequired.includes(currentSkillFilter));

    renderTeams(filtered);
  });
}

// ========== 渲染队伍列表 ==========
function renderTeams(teams) {
  const container = document.getElementById('team-list');

  if (teams.length === 0) {
    container.innerHTML = '<p style="color: var(--color-gray-mid); grid-column: 1 / -1;">暂无符合条件的队伍，快来发布组队信息吧！</p>';
    return;
  }

  const sorted = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));

  container.innerHTML = sorted.map(team => `
    <div class="card team-card">
      ${team.score ? `<span class="team-card__score">${team.score}分</span>` : ''}
      <div class="card__header">
        <div>
          <div class="team-card__captain">
            <span class="team-card__avatar">${generateAvatar(team.captain || team.author || '匿名')}</span>
            <span>${team.captain || team.author || '匿名'}</span>
          </div>
          <h3 class="card__title">${team.title}</h3>
        </div>
      </div>
      <div class="card__body">
        <p style="text-transform: none;">${team.description}</p>
        <div style="margin-top: 12px;">
          ${(team.skillsRequired || []).map(s => `<span class="tag">${s}</span>`).join(' ')}
        </div>
      </div>
      <div class="card__footer">
        <span class="card__meta">${team.currentMembers || 0}/${team.maxMembers || '?'} 人 · ${formatDate(team.createdAt)}</span>
        <span class="card__meta">${team.contact || ''}</span>
      </div>
    </div>
  `).join('');
}

init();
