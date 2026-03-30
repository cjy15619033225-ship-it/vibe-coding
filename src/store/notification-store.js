/**
 * 消息通知 Store（localStorage 持久化）
 * - 评论回复通知
 * - 报名结果通知
 */

import { getApplications } from './application-store';
import { getComments } from './social-store';
import { getClubs } from './club-store';

const READ_KEY = 'club_recruit_notification_read';

// ── 已读状态 ──

function getReadSet() {
  const raw = localStorage.getItem(READ_KEY);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

function saveReadSet(set) {
  localStorage.setItem(READ_KEY, JSON.stringify([...set]));
}

export function markAsRead(notificationId) {
  const set = getReadSet();
  set.add(notificationId);
  saveReadSet(set);
}

export function markAllAsRead(ids) {
  const set = getReadSet();
  ids.forEach((id) => set.add(id));
  saveReadSet(set);
}

// ── 生成通知列表 ──

/** 评论回复通知：模拟其他人对"我"评论的回复 */
export function getCommentNotifications() {
  const clubs = getClubs();
  const readSet = getReadSet();
  const notifications = [];

  // 预置一些回复通知（模拟别人回复了你的评论）
  const mockReplies = [
    { clubId: 'basketball', from: '李学姐', content: '对呀！下次友谊赛一起来', time: '2026-09-05', replyTo: '我也想参加篮球社！' },
    { clubId: 'guitar', from: '王同学', content: '推荐你先学弹唱，入门最快', time: '2026-09-06', replyTo: '零基础可以加入吗？' },
    { clubId: 'coding', from: '陈同学', content: '当然可以，我也是大一才开始学的', time: '2026-09-08', replyTo: '编程社对新手友好吗？' },
    { clubId: 'drama', from: '吴同学', content: '完全没问题，我们有专门的新人培训', time: '2026-09-04', replyTo: '没有表演经验能参加吗？' },
    { clubId: 'boardgame', from: '郑同学', content: '周五晚上七点在活动中心，欢迎来玩！', time: '2026-09-10', replyTo: '桌游夜一般什么时候？' },
  ];

  const clubMap = Object.fromEntries(clubs.map((c) => [c.id, c]));

  mockReplies.forEach((r, i) => {
    const club = clubMap[r.clubId];
    if (!club) return;
    const id = `reply_${i}`;
    notifications.push({
      id,
      type: 'comment_reply',
      clubId: r.clubId,
      clubName: club.name,
      clubLogo: club.logo,
      from: r.from,
      content: r.content,
      replyTo: r.replyTo,
      time: r.time,
      isRead: readSet.has(id),
    });
  });

  // 用户自己发的评论也生成"收到回复"通知
  clubs.forEach((club) => {
    const comments = getComments(club.id);
    const userComments = comments.filter((c) => c.user === '我');
    userComments.forEach((uc) => {
      // 找到在这条评论之后的其他人评论作为"回复"
      const idx = comments.indexOf(uc);
      const replies = comments.slice(idx + 1).filter((c) => c.user !== '我');
      replies.forEach((reply) => {
        const id = `reply_real_${reply.id}`;
        notifications.push({
          id,
          type: 'comment_reply',
          clubId: club.id,
          clubName: club.name,
          clubLogo: club.logo,
          from: reply.user,
          content: reply.content,
          replyTo: uc.content,
          time: reply.time,
          isRead: readSet.has(id),
        });
      });
    });
  });

  return notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
}

/** 报名结果通知 */
export function getApplicationNotifications() {
  const apps = getApplications();
  const clubs = getClubs();
  const readSet = getReadSet();
  const clubMap = Object.fromEntries(clubs.map((c) => [c.id, c]));

  return apps
    .map((app) => {
      const club = clubMap[app.clubId];
      const id = `app_${app.id}`;
      return {
        id,
        type: 'application',
        clubId: app.clubId,
        clubName: club?.name || '未知社团',
        clubLogo: club?.logo || '📋',
        status: app.status,
        name: app.name,
        time: new Date(app.createdAt).toISOString().slice(0, 10),
        updatedAt: app.updatedAt ? new Date(app.updatedAt).toISOString().slice(0, 10) : null,
        isRead: readSet.has(id),
      };
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

/** 获取未读消息总数 */
export function getUnreadCount() {
  const comments = getCommentNotifications();
  const apps = getApplicationNotifications();
  return [...comments, ...apps].filter((n) => !n.isRead).length;
}
