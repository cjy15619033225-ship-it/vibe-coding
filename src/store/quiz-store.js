/**
 * 问卷结果 Store（localStorage 持久化）
 * 存储用户答题选项 + 计算后的兴趣向量
 */

const STORAGE_KEY = 'club_recruit_quiz';

/** 保存问卷结果 */
export function saveQuizResult(result) {
  // result: { answers: Array<{questionId, optionIndex, weights}>, userVector, timestamp }
  const data = {
    ...result,
    timestamp: result.timestamp || Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

/** 获取已保存的问卷结果，不存在返回 null */
export function getQuizResult() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** 清除问卷结果（重新测试时） */
export function clearQuizResult() {
  localStorage.removeItem(STORAGE_KEY);
}

/** 是否已完成过测试 */
export function hasQuizResult() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
