/**
 * 兴趣测试问卷 — 8 题混合交互
 * - 6 道图片选择题（每题配场景图 + 选项 emoji）
 * - 1 道滑动量表题
 * - 1 道拖拽排序题
 *
 * 12 维度标签: 体育 文艺 学术 科技 社交 创意 公益 户外 竞技 手工 音乐 表演
 */

export const INTEREST_TAGS = [
  '体育', '文艺', '学术', '科技', '社交', '创意',
  '公益', '户外', '竞技', '手工', '音乐', '表演',
];

export const quizQuestions = [
  {
    id: 1,
    type: 'choice',
    question: '周末你最想做什么？',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80',
    options: [
      { label: '打一场酣畅淋漓的球赛', emoji: '🏀', weights: { 体育: 5, 竞技: 3, 户外: 2 } },
      { label: '窝在家看书或纪录片', emoji: '📚', weights: { 学术: 5, 文艺: 2 } },
      { label: '约朋友一起聚会玩桌游', emoji: '🎲', weights: { 社交: 5, 竞技: 2 } },
      { label: '动手做点有趣的东西', emoji: '🎨', weights: { 创意: 4, 手工: 4, 科技: 2 } },
    ],
  },
  {
    id: 2,
    type: 'choice',
    question: '你更喜欢哪种校园活动？',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    options: [
      { label: '音乐节 / 弹唱会', emoji: '🎵', weights: { 音乐: 5, 文艺: 3, 表演: 2 } },
      { label: '编程竞赛 / 黑客马拉松', emoji: '💻', weights: { 科技: 5, 学术: 3, 竞技: 2 } },
      { label: '话剧 / 戏剧表演', emoji: '🎭', weights: { 表演: 5, 文艺: 3, 创意: 2 } },
      { label: '志愿服务 / 公益活动', emoji: '💛', weights: { 公益: 5, 社交: 3 } },
    ],
  },
  {
    id: 3,
    type: 'choice',
    question: '哪种技能你最想get？',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    options: [
      { label: '学一门乐器', emoji: '🎸', weights: { 音乐: 5, 文艺: 2, 创意: 2 } },
      { label: '提升演讲和辩论能力', emoji: '🎤', weights: { 学术: 4, 表演: 3, 社交: 3 } },
      { label: '学会摄影 / 视频剪辑', emoji: '📷', weights: { 创意: 5, 文艺: 2, 户外: 2 } },
      { label: '掌握一项运动', emoji: '⚽', weights: { 体育: 5, 竞技: 3, 户外: 2 } },
    ],
  },
  {
    id: 4,
    type: 'choice',
    question: '和朋友在一起时你通常扮演什么角色？',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    options: [
      { label: '气氛组担当，带动全场', emoji: '🔥', weights: { 社交: 5, 表演: 3 } },
      { label: '点子王，总能想出好主意', emoji: '💡', weights: { 创意: 5, 科技: 2 } },
      { label: '行动派，说干就干', emoji: '⚡', weights: { 体育: 3, 竞技: 3, 户外: 2 } },
      { label: '倾听者，给出靠谱建议', emoji: '🤝', weights: { 学术: 3, 公益: 3, 文艺: 2 } },
    ],
  },
  {
    id: 5,
    type: 'slider',
    question: '你更倾向于哪种社交方式？',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80',
    leftLabel: '享受独处',
    leftEmoji: '🧘',
    rightLabel: '热爱社交',
    rightEmoji: '🎉',
    // 滑动值 0-100，左侧偏向 学术/文艺/手工，右侧偏向 社交/表演/公益
    leftWeights: { 学术: 4, 文艺: 3, 手工: 3 },
    rightWeights: { 社交: 4, 表演: 3, 公益: 3 },
  },
  {
    id: 6,
    type: 'choice',
    question: '如果参加社团，你最看重什么？',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80',
    options: [
      { label: '认识更多志同道合的朋友', emoji: '👥', weights: { 社交: 5, 公益: 2 } },
      { label: '学到实用的新技能', emoji: '🛠️', weights: { 科技: 3, 学术: 3, 手工: 3 } },
      { label: '有展示自我的舞台', emoji: '🌟', weights: { 表演: 5, 音乐: 2, 文艺: 2 } },
      { label: '参加比赛拿奖', emoji: '🏆', weights: { 竞技: 5, 体育: 2, 科技: 2 } },
    ],
  },
  {
    id: 7,
    type: 'rank',
    question: '给以下活动排个优先级吧！',
    subtitle: '长按拖动排序，最想参加的放最前面',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80',
    items: [
      { label: '运动竞技', emoji: '🏅', weights: { 体育: 5, 竞技: 4, 户外: 2 } },
      { label: '文艺演出', emoji: '🎭', weights: { 表演: 5, 音乐: 4, 文艺: 2 } },
      { label: '科技创新', emoji: '🚀', weights: { 科技: 5, 学术: 3, 创意: 2 } },
      { label: '公益志愿', emoji: '💚', weights: { 公益: 5, 社交: 3 } },
      { label: '手工创作', emoji: '✂️', weights: { 手工: 5, 创意: 4 } },
    ],
  },
  {
    id: 8,
    type: 'choice',
    question: '选一个你最心动的场景：',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    options: [
      { label: '舞台上聚光灯亮起的那一刻', emoji: '✨', weights: { 表演: 5, 音乐: 3, 文艺: 2 } },
      { label: '赛场上比分反超的瞬间', emoji: '🔥', weights: { 竞技: 5, 体育: 4 } },
      { label: '自己做的作品被人称赞', emoji: '🎨', weights: { 创意: 4, 手工: 4, 科技: 2 } },
      { label: '帮助他人时对方的笑容', emoji: '😊', weights: { 公益: 5, 社交: 3 } },
    ],
  },
];

/** 性格标签映射 — 根据最高维度组合生成标签 */
export const PERSONALITY_LABELS = {
  '体育+竞技': { title: '热血竞技家', desc: '你天生热爱挑战，球场和赛道就是你的主场', emoji: '🏆' },
  '文艺+音乐': { title: '文艺浪漫派', desc: '你的灵魂里住着诗和音乐，感性是你的超能力', emoji: '🎵' },
  '学术+科技': { title: '理性探索者', desc: '你对知识和技术充满好奇，逻辑是你的武器', emoji: '🔬' },
  '科技+创意': { title: '创新极客', desc: '你用技术实现创意，是天生的造物者', emoji: '🚀' },
  '社交+表演': { title: '舞台闪耀星', desc: '人群中你最耀眼，天生的社交达人和表演者', emoji: '🌟' },
  '创意+手工': { title: '创意匠人', desc: '你的双手能创造奇迹，每件作品都有灵魂', emoji: '🎨' },
  '公益+社交': { title: '温暖行动派', desc: '你用行动温暖他人，社区因你而更美好', emoji: '💛' },
  '户外+体育': { title: '自由探险家', desc: '大自然是你的游乐场，自由和运动是你的标签', emoji: '🏔️' },
  '表演+文艺': { title: '灵感表达者', desc: '你用表演诠释内心，是天生的艺术灵魂', emoji: '🎭' },
  '音乐+创意': { title: '旋律创作人', desc: '音符在你指尖流淌，创造力无限', emoji: '🎸' },
};

/** 根据兴趣向量获取性格标签 */
export function getPersonalityLabel(userVector) {
  const sorted = INTEREST_TAGS
    .map((t) => ({ tag: t, score: userVector[t] || 0 }))
    .sort((a, b) => b.score - a.score);

  const top2 = sorted.slice(0, 2).map((t) => t.tag);
  const key1 = `${top2[0]}+${top2[1]}`;
  const key2 = `${top2[1]}+${top2[0]}`;

  return (
    PERSONALITY_LABELS[key1] ||
    PERSONALITY_LABELS[key2] ||
    { title: '多元发展者', desc: '你兴趣广泛、全面发展，任何社团都适合你', emoji: '🌈' }
  );
}

export default quizQuestions;
