import { INTEREST_TAGS } from '../data/quiz-questions.js';
import clubs from '../data/clubs.js';

/**
 * 将用户答题结果汇总为 12 维兴趣向量
 * 支持三种题型：choice / slider / rank
 * @param {Array} answers - 用户选中的选项列表
 * @returns {Record<string, number>} tag → 累计得分
 */
export function buildUserVector(answers) {
  const vec = {};
  INTEREST_TAGS.forEach((t) => (vec[t] = 0));

  answers.forEach((a) => {
    if (a.type === 'slider') {
      // 滑动量表：按比例混合左右权重
      const ratio = (a.value || 50) / 100;
      Object.entries(a.leftWeights).forEach(([tag, w]) => {
        if (tag in vec) vec[tag] += w * (1 - ratio);
      });
      Object.entries(a.rightWeights).forEach(([tag, w]) => {
        if (tag in vec) vec[tag] += w * ratio;
      });
    } else if (a.type === 'rank') {
      // 排序题：按排名给递减权重（第1名×5, 第2名×4...）
      a.order.forEach((item, idx) => {
        const multiplier = Math.max(5 - idx, 1);
        Object.entries(item.weights).forEach(([tag, w]) => {
          if (tag in vec) vec[tag] += w * multiplier * 0.4;
        });
      });
    } else {
      // 普通选择题
      Object.entries(a.weights).forEach(([tag, w]) => {
        if (tag in vec) vec[tag] += w;
      });
    }
  });

  return vec;
}

/**
 * 余弦相似度
 */
export function cosineSimilarity(vecA, vecB) {
  const keys = INTEREST_TAGS;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  keys.forEach((k) => {
    const a = vecA[k] || 0;
    const b = vecB[k] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * 匹配所有社团并按相似度排序
 */
export function matchClubs(userVector) {
  return clubs
    .map((club) => ({
      club,
      score: cosineSimilarity(userVector, club.tagWeights),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * 端到端：传入答题选项，返回排序后的匹配结果
 */
export function getMatchResults(answers) {
  const userVector = buildUserVector(answers);
  return { userVector, results: matchClubs(userVector) };
}
