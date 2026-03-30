import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, FileCheck, CheckCheck } from 'lucide-react';
import {
  getCommentNotifications,
  getApplicationNotifications,
  markAsRead,
  markAllAsRead,
} from '../../store/notification-store';

const TABS = [
  { key: 'comments', label: '评论回复', icon: MessageCircle },
  { key: 'applications', label: '报名结果', icon: FileCheck },
];

const STATUS_MAP = {
  pending: { label: '审核中', color: 'text-amber-500', bg: 'bg-amber-50' },
  approved: { label: '已通过', color: 'text-green-600', bg: 'bg-green-50' },
  rejected: { label: '未通过', color: 'text-red-500', bg: 'bg-red-50' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('comments');
  const [, forceUpdate] = useState(0);

  const commentNotifs = getCommentNotifications();
  const appNotifs = getApplicationNotifications();

  const currentList = tab === 'comments' ? commentNotifs : appNotifs;
  const unreadComments = commentNotifs.filter((n) => !n.isRead).length;
  const unreadApps = appNotifs.filter((n) => !n.isRead).length;

  function handleMarkAllRead() {
    const ids = currentList.map((n) => n.id);
    markAllAsRead(ids);
    forceUpdate((v) => v + 1);
  }

  function handleTap(notif) {
    markAsRead(notif.id);
    forceUpdate((v) => v + 1);
    if (notif.clubId) {
      navigate(`/club/${notif.clubId}`);
    }
  }

  return (
    <div className="animate-fade-in bg-[var(--color-bg-secondary)] min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 pt-12 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold">消息通知</h1>
          <button onClick={handleMarkAllRead} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
            <CheckCheck size={14} />
            全部已读
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 bg-[var(--color-bg-secondary)] rounded-xl p-1">
          {TABS.map((t) => {
            const unread = t.key === 'comments' ? unreadComments : unreadApps;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <t.icon size={15} />
                {t.label}
                {unread > 0 && (
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold px-1">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-3 space-y-2 pb-24">
        {currentList.length === 0 && (
          <div className="text-center py-16 text-[var(--color-text-dim)] text-sm">暂无消息</div>
        )}

        {tab === 'comments' &&
          commentNotifs.map((n) => (
            <button
              key={n.id}
              onClick={() => handleTap(n)}
              className={`w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] ${
                n.isRead ? 'bg-white' : 'bg-white ring-1 ring-[var(--color-accent)]/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{n.clubLogo}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                               <p className="text-sm font-semibold">{n.from}</p>
                    <p className="text-[10px] text-[var(--color-text-dim)]">{n.time}</p>
                  </div>
                  <p className="text-sm mt-1 leading-snug">{n.content}</p>
                  <div className="mt-2 bg-[var(--color-bg-secondary)] rounded-lg px-3 py-2">
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">我: {n.replyTo}</p>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-dim)] mt-1.5">{n.clubName}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0 mt-2" />}
              </div>
            </button>
          ))}

        {tab === 'applications' &&
          appNotifs.map((n) => {
            const st = STATUS_MAP[n.status] || STATUS_MAP.pending;
            return (
              <button
                key={n.id}
                onClick={() => handleTap(n)}
                className={`w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] ${
                  n.isRead ? 'bg-white' : 'bg-white ring-1 ring-[var(--color-accent)]/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{n.clubLogo}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{n.clubName}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color} ${st.bg}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-[var(--color-text-secondary)]">
                      {n.status === 'pending' && '你的报名申请正在审核中，请耐心等待'}
                      {n.status === 'approved' && '恭喜！你的报名已通过，请关注后续通知'}
                      {n.status === 'rejected' && '很遗憾，你的报名未通过，可尝试其他社团'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-[var(--color-text-dim)]">申请人: {n.name}</p>
                      <p className="text-[10px] text-[var(--color-text-dim)]">{n.updatedAt || n.time}</p>
                    </div>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0 mt-2" />}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
