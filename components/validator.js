// components/validator.js
// 表单正则校验引擎

/**
 * 校验规则定义
 */
const defaultRules = {
  teamName: {
    pattern: /^.{2,20}$/,
    message: '队伍名称需要 2-20 个字符'
  },
  contact: {
    pattern: /^(微信|QQ|邮箱|手机)\s*[:：]\s*.+/,
    message: '请按格式填写，如：微信: your_id'
  },
  maxMembers: {
    pattern: /^([2-9]|10)$/,
    message: '队伍人数需在 2-10 人之间'
  },
  description: {
    validator: (value) => value.length >= 10 && value.length <= 500,
    message: '描述需要 10-500 个字符'
  }
};

/**
 * 校验单个字段
 * @param {string} value 字段值
 * @param {object} rule 校验规则 { pattern?, validator?, message }
 * @returns {{ valid: boolean, message: string }}
 */
export function validateField(value, rule) {
  const trimmed = value.trim();

  if (rule.pattern) {
    const valid = rule.pattern.test(trimmed);
    return { valid, message: valid ? '' : rule.message };
  }

  if (rule.validator) {
    const valid = rule.validator(trimmed);
    return { valid, message: valid ? '' : rule.message };
  }

  return { valid: true, message: '' };
}

/**
 * 校验整个表单
 * @param {object} formData { fieldName: value, ... }
 * @param {object} [rules=defaultRules] 校验规则集
 * @returns {{ valid: boolean, errors: { [field]: string } }}
 */
export function validateForm(formData, rules = defaultRules) {
  const errors = {};
  let valid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const value = formData[field] ?? '';
    const result = validateField(value, rule);
    if (!result.valid) {
      errors[field] = result.message;
      valid = false;
    }
  }

  return { valid, errors };
}

/**
 * 获取默认校验规则
 * @returns {object}
 */
export function getDefaultRules() {
  return { ...defaultRules };
}
