import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, Megaphone, ChevronRight, Heart, MessageCircle, Send } from 'lucide-react';
import { getClubById } from '../../store/club-store';
import { getLikes, toggleLike, getComments, addComment } from '../../store/social-store';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const club = getClubById(id);

  const [likes, setLikes] = useState(() => getLikes(id));
  const [comments, setComments] = useState(() => getComments(id));
  const [newComment, setNewComment] = useState('');
  const [userName] = useState(() => '匿名同学');

  if (!club) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">社团不存在</p>
        <button onClick={() => navigate(-1)} className="btn-primary text-sm">返回</button>
      </div>
    );
  }

  function handleLike() {
    setLikes(toggleLike(id));
  }

  function handleComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(id, userName, newComment.trim());
    setComments(getComments(id));
    setNewComment('');
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="px-5 pt-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center mb-3">
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* 封面图 */}
      <img src={club.cover} alt={club.name} className="w-full aspect-[4/3] object-cover" />

      {/* 互动栏 */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center gap-5">
          <button onClick={handleLike} className="active:scale-90 transition-transform">
            <Heart size={24} strokeWidth={1.5} className={likes.liked ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : ''} />
          </button>
          <MessageCircle size={24} strokeWidth={1.5} />
          <Send size={22} strokeWidth={1.5} />
        </div>
        <p className="text-xs font-semibold mt-2">{likes.count.toLocaleString()} 次赞</p>
      </div>

      {/* 社团信息 */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg bg-[var(--color-bg-secondary)]">
            {club.logo}
          </div>
          <div>
            <h1 className="text-lg font-bold">{club.name}</h1>
            <p className="text-[11px] text-[var(--color-text-dim)]">{club.slogan}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
            <Users size={13} /> {club.memberCount} 人
          </span>
          <span className="text-xs text-[var(--color-border)]">·</span>
          <span className="text-xs text-[var(--color-text-secondary)]">{club.category}</span>
          {club.recruiting && (
            <>
              <span className="text-xs text-[var(--color-border)]">·</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600">招新中</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {club.tags.map((t) => (
            <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] font-medium">{t}</span>
          ))}
        </div>
      </div>

      {/* 简介 */}
      <section className="px-5 mb-4">
        <h2 className="text-sm font-semibold mb-2">社团简介</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{club.description}</p>
      </section>

      {/* 亮点 */}
      {club.highlights.length > 0 && (
        <section className="px-5 mb-4">
          <h2 className="text-sm font-semibold mb-2">社团亮点</h2>
          <div className="flex flex-wrap gap-2">
            {club.highlights.map((h, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">✦ {h}</span>
            ))}
          </div>
        </section>
      )}

      {/* 活动 */}
      {club.activities.length > 0 && (
        <section className="px-5 mb-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Calendar size={14} /> 近期活动</h2>
          <div className="space-y-2">
            {club.activities.map((a, i) => (
              <div key={i} className="card p-3 flex items-center justify-between">
                <span className="text-sm">{a.title}</span>
                <span className="text-[10px] text-[var(--color-text-dim)]">{a.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 公告 */}
      {club.announcements.length > 0 && (
        <section className="px-5 mb-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Megaphone size={14} /> 公告</h2>
          <div className="space-y-2">
            {club.announcements.map((a, i) => (
              <div key={i} className="card p-3">
                <p className="text-sm">{a.content}</p>
                <p className="text-[10px] text-[var(--color-text-dim)] mt-1">{a.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 评论区 ── */}
      <section className="px-5 mb-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
          <MessageCircle size={14} /> 评论 ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-sm text-[var(--color-text-dim)] py-4 text-center">还没有评论，来说点什么吧</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-xs font-bold text-[var(--color-text-secondary)] shrink-0 mt-0.5">
                  {c.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{c.user}</span>
                    <span className="text-[10px] text-[var(--color-text-dim)]">{c.time}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 leading-snug">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 底部固定：报名 + 评论输入 ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[var(--color-border)] z-50 safe-bottom">
        <form onSubmit={handleComment} className="flex items-center gap-2 px-4 py-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写评论…"
            className="flex-1 bg-[var(--color-bg-secondary)] rounded-full px-4 py-2 text-sm outline-none"
          />
          <button type="submit" disabled={!newComment.trim()} className="text-[var(--color-primary)] disabled:text-[var(--color-text-dim)] font-semibold text-sm px-2">
            发送
          </button>
          {club.recruiting && (
            <button
              type="button"
              onClick={() => navigate(`/club/${club.id}/apply`)}
              className="bg-[var(--color-primary)] text-white text-xs font-semibold px-4 py-2 rounded-full shrink-0"
            >
              报名
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
