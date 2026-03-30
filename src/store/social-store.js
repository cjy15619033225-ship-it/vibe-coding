/**
 * 社交互动 Store（点赞 + 评论）— localStorage 持久化
 */

const LIKES_KEY = 'club_recruit_likes';
const COMMENTS_KEY = 'club_recruit_comments';

// ── 预置评论 ──
const DEFAULT_COMMENTS = {
  basketball: [
    { id: 'c1', user: '张同学', content: '上学期参加了友谊赛，氛围超好！强烈推荐', time: '2026-09-02' },
    { id: 'c2', user: '李学姐', content: '零基础也完全没问题，学长学姐都很耐心教', time: '2026-09-01' },
  ],
  guitar: [
    { id: 'c3', user: '王同学', content: '弹唱之夜太浪漫了，一学期学会了好几首歌', time: '2026-09-04' },
    { id: 'c4', user: '赵学长', content: '社团免费提供吉他练习，入门成本为零', time: '2026-09-03' },
  ],
  coding: [
    { id: 'c5', user: '陈同学', content: 'Hackathon拿了二等奖！简历加分利器', time: '2026-09-07' },
    { id: 'c6', user: '刘学姐', content: '从零基础到做出自己的网站，编程社改变了我', time: '2026-09-05' },
  ],
  volunteer: [
    { id: 'c7', user: '孙同学', content: '每次活动都很有意义，志愿时长也够了', time: '2026-09-01' },
    { id: 'c8', user: '周学长', content: '认识了一群有爱的朋友，大学最正确的选择', time: '2026-08-30' },
  ],
  drama: [
    { id: 'c9', user: '吴同学', content: '上学期大戏演出太震撼了，今年一定要参加', time: '2026-09-02' },
  ],
  boardgame: [
    { id: 'c10', user: '郑同学', content: '周五桌游夜是我每周最期待的事！', time: '2026-09-09' },
    { id: 'c11', user: '钱学姐', content: '社恐救星，玩着玩着就认识好多朋友了', time: '2026-09-08' },
  ],
  anime: [
    { id: 'c12', user: '许同学', content: '去年漫展组队超开心，期待今年的Cosplay工作坊', time: '2026-09-03' },
  ],
  photography: [
    { id: 'c13', user: '何同学', content: '手机摄影班学到很多技巧，朋友圈质量飙升', time: '2026-09-04' },
  ],
  debate: [
    { id: 'c14', user: '林同学', content: '辩论真的锻炼思维，面试的时候特别有用', time: '2026-09-02' },
  ],
  robotics: [
    { id: 'c15', user: '黄同学', content: '实验室设备很全，RoboMaster备赛超刺激', time: '2026-09-05' },
  ],
};

// ── Likes ──

function getLikesMap() {
  const raw = localStorage.getItem(LIKES_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveLikesMap(map) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(map));
}

export function getLikes(clubId) {
  const map = getLikesMap();
  return map[clubId] || { count: Math.floor(Math.random() * 800 + 200), liked: false };
}

export function toggleLike(clubId) {
  const map = getLikesMap();
  const current = map[clubId] || { count: Math.floor(Math.random() * 800 + 200), liked: false };
  current.liked = !current.liked;
  current.count += current.liked ? 1 : -1;
  map[clubId] = current;
  saveLikesMap(map);
  return current;
}

// ── Comments ──

function getCommentsMap() {
  const raw = localStorage.getItem(COMMENTS_KEY);
  if (raw) return JSON.parse(raw);
  // 首次初始化预置评论
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(DEFAULT_COMMENTS));
  return { ...DEFAULT_COMMENTS };
}

function saveCommentsMap(map) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(map));
}

export function getComments(clubId) {
  const map = getCommentsMap();
  return map[clubId] || [];
}

export function addComment(clubId, user, content) {
  const map = getCommentsMap();
  if (!map[clubId]) map[clubId] = [];
  const comment = {
    id: `c_${Date.now()}`,
    user,
    content,
    time: new Date().toISOString().slice(0, 10),
  };
  map[clubId].push(comment);
  saveCommentsMap(map);
  return comment;
}

export function getCommentCount(clubId) {
  return getComments(clubId).length;
}
