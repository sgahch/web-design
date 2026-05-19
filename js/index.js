// js/index.js
// 首页入口模块

import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { fetchJSON, formatDate, generateAvatar } from '../components/utils.js';

// 初始化页眉页脚
renderHeader('index');
renderFooter();

// ========== Swiper 轮播（动态加载 + 可点击跳转） ==========
async function initSwiper() {
  const data = await fetchJSON('public/data/competitions.json');
  const wrapper = document.querySelector('.hero-swiper .swiper-wrapper');

  wrapper.innerHTML = data.competitions.map(comp => `
    <div class="swiper-slide">
      <a href="views/match.html?id=${comp.id}" class="swiper-slide__link">
        <img src="${comp.image}" alt="${comp.title}" class="swiper-slide__img">
        <div class="swiper-slide__overlay">
          <span class="swiper-slide__title">${comp.title}</span>
          <span class="swiper-slide__desc">${comp.description.slice(0, 50)}...</span>
        </div>
      </a>
    </div>
  `).join('');

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
}

initSwiper();

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
    comp.teams.map(team => ({ ...team, competitionId: comp.id, competitionTitle: comp.title }))
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
        <a href="views/match.html?id=${team.competitionId}" class="btn btn--sm">查看详情</a>
      </div>
    </div>
  `).join('');

  // 响应式图表
  window.addEventListener('resize', () => chart.resize());
}

initDashboard();
