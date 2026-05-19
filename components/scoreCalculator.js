// components/scoreCalculator.js
// 组队吸引力得分实时计算

/**
 * 计算完整度得分（满分 40）
 * @param {object} formData
 * @returns {number}
 */
function calcCompleteness(formData) {
  const requiredFields = ['teamName', 'description', 'contact', 'maxMembers'];
  const filled = requiredFields.filter(field => {
    const val = formData[field];
    return val && val.toString().trim().length > 0;
  });
  return (filled.length / requiredFields.length) * 40;
}

/**
 * 计算技能丰富度得分（满分 20）
 * @param {object} formData
 * @returns {number}
 */
function calcSkillRichness(formData) {
  const skills = formData.skillsRequired || [];
  const count = Array.isArray(skills) ? skills.length : 0;
  if (count === 0) return 0;
  if (count === 1) return 8;
  if (count === 2) return 14;
  if (count >= 3) return 20;
  return 0;
}

/**
 * 计算描述质量得分（满分 20）
 * @param {object} formData
 * @returns {number}
 */
function calcDescQuality(formData) {
  const desc = (formData.description || '').trim();
  const len = desc.length;
  if (len < 10) return 0;
  if (len < 50) return 8;
  if (len < 100) return 12;
  if (len < 200) return 16;
  return 20;
}

/**
 * 计算联系方式有效性得分（满分 20）
 * @param {object} formData
 * @returns {number}
 */
function calcContactValid(formData) {
  const contact = (formData.contact || '').trim();
  const pattern = /^(微信|QQ|邮箱|手机)\s*[:：]\s*.+/;
  return pattern.test(contact) ? 20 : 0;
}

/**
 * 计算总得分
 * @param {object} formData
 * @returns {number} 0-100
 */
export function calculateScore(formData) {
  const completeness = calcCompleteness(formData);
  const skillRichness = calcSkillRichness(formData);
  const descQuality = calcDescQuality(formData);
  const contactValid = calcContactValid(formData);
  return Math.round(completeness + skillRichness + descQuality + contactValid);
}
