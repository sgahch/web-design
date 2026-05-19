// components/storage.js
// localStorage 封装 — 个人简历 + 帖子数据持久化

const STORAGE_KEY = 'competition_platform_profile';
const POSTS_KEY = 'competition_platform_posts';

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

// ========== 帖子数据管理 ==========

/**
 * 从 localStorage 加载用户发布的帖子
 * @returns {Array} 帖子数组
 */
export function loadUserPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load posts from localStorage:', e);
  }
  return [];
}

/**
 * 保存用户发布的帖子到 localStorage
 * @param {Array} posts 帖子数组
 */
export function saveUserPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Failed to save posts to localStorage:', e);
  }
}

/**
 * 添加一条新帖子
 * @param {object} post 帖子对象
 * @returns {object} 添加后的帖子（含 id）
 */
export function addPost(post) {
  const posts = loadUserPosts();
  post.id = Date.now();
  post.createdAt = new Date().toISOString().split('T')[0];
  post.likes = 0;
  post.comments = [];
  posts.unshift(post);
  saveUserPosts(posts);
  return post;
}

/**
 * 添加一条组队信息到指定竞赛
 * @param {number} competitionId 竞赛 ID
 * @param {object} team 组队对象
 * @returns {object} 添加后的组队信息
 */
export function addTeamToCompetition(competitionId, team) {
  const posts = loadUserPosts();
  team.id = Date.now();
  team.createdAt = new Date().toISOString().split('T')[0];
  team.competitionId = competitionId;
  team.type = 'team';
  posts.unshift(team);
  saveUserPosts(posts);
  return team;
}

/**
 * 合并 JSON 演示帖子与 localStorage 用户帖子
 * @param {Array} jsonPosts 来自 community.json 的帖子
 * @returns {Array} 合并后的帖子（用户帖子在前）
 */
export function mergePostsWithJson(jsonPosts) {
  const userPosts = loadUserPosts().filter(p => p.type !== 'team');
  return [...userPosts, ...jsonPosts];
}

/**
 * 获取指定竞赛的组队信息（JSON + localStorage 合并）
 * @param {Array} jsonTeams 来自 competitions.json 的队伍
 * @param {number} competitionId 竞赛 ID
 * @returns {Array} 合并后的队伍列表
 */
export function getTeamsForCompetition(jsonTeams, competitionId) {
  const userTeams = loadUserPosts().filter(
    p => p.type === 'team' && p.competitionId === competitionId
  );
  return [...userTeams, ...jsonTeams];
}
