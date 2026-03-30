import { useNavigate } from 'react-router-dom';
import { FlaskConical, Compass, Sparkles, Megaphone, Bell } from 'lucide-react';
import { getClubs } from '../../store/club-store';
import { hasQuizResult } from '../../store/quiz-store';
import { getUnreadCount } from '../../store/notification-store';

const HERO_BG = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80';

export default function Home() {
  const navigate = useNavigate();
  const clubs = getClubs();
  const quizDone = hasQuizResult();

  const hotClubs = [...clubs].sort((a, b) => b.memberCount - a.memberCount).slice(0, 6);
  const unreadCount = getUnreadCount();

  const announcements = clubs
    .flatMap((c) => c.announcements.map((a) => ({ ...a, clubName: c.name, clubLogo: c.logo, clubId: c.id })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="animate-fade-in bg-[var(--color-bg-secondary)]">
      {/* ── Hero Banner ── */}
      <section
        className="relative overflow-hidden rounded-b-3xl"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        {/* 消息通知入口 */}
        <button
          onClick={() => navigate('/notifications')}
          className="absolute top-12 right-4 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-[0.92] transition-transform"
        >
          <Bell size={18} className="text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <div className="relative z-10 px-5 pt-14 pb-10">
          <p className="text-white/70 text-sm mb-2 animate-fade-in-up delay-1">2026 秋季招新</p>
          <h1 className="text-[1.75rem] font-bold leading-tight text-white animate-fade-in-up delay-2">
            找到属于你的
            <br />
            <span className="text-[var(--color-accent-light)]">理想社团</span>
          </h1>
          <p className="text-white/70 text-sm mt-3 leading-relaxed animate-fade-in-up delay-3">
            完成兴趣测试，AI 为你智能匹配最适合的社团
          </p>
          <button
            onClick={() => navigate(quizDone ? '/quiz/result' : '/quiz')}
            className="mt-5 inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-semibold text-sm px-6 py-3 rounded-full shadow-lg active:scale-[0.97] transition-transform animate-fade-in-up delay-4"
          >
            <Sparkles size={16} />
            {quizDone ? '查看匹配结果' : '开始兴趣测试'}
          </button>
        </div>
      </section>

      {/* ── 快捷入口 ── */}
      <section className="px-4 -mt-5 relative z-20 mb-3">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(quizDone ? '/quiz/result' : '/quiz')}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] active:scale-[0.97] transition-transform text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                <FlaskConical size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">兴趣测试</p>
                <p className="text-[10px] text-[var(--color-text-dim)]">发现你的兴趣</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] active:scale-[0.97] transition-transform text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                <Compass size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">社团广场</p>
                <p className="text-[10px] text-[var(--color-text-dim)]">浏览全部社团</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── 热门社团 ── */}
      <section className="mx-4 mb-3 bg-white rounded-2xl shadow-sm py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-bold">热门社团</h2>
          <button onClick={() => navigate('/explore')} className="text-xs text-[var(--color-text-secondary)]">
            查看全部 →
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scrollbar-none">
          {hotClubs.map((club) => (
            <button
              key={club.id}
              onClick={() => navigate(`/club/${club.id}`)}
              className="rounded-2xl min-w-[160px] snap-start shrink-0 text-left active:scale-[0.97] transition-transform overflow-hidden shadow-sm bg-white"
            >
              <img
                src={club.cover}
                alt={club.name}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{club.logo}</span>
                  <p className="text-sm font-semibold truncate">{club.name}</p>
                </div>
                <p className="text-[10px] text-[var(--color-text-dim)]">{club.memberCount} 人</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {club.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── 最新公告 ── */}
      {announcements.length > 0 && (
        <section className="mx-4 mb-4 bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5">
            <Megaphone size={16} />
            最新公告
          </h2>
          <div className="space-y-2">
            {announcements.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(`/club/${a.clubId}`)}
                className="w-full bg-[var(--color-bg-secondary)] rounded-xl px-4 py-3 flex items-start gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <span className="text-xl shrink-0">{a.clubLogo}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-accent)]">{a.clubName}</p>
                  <p className="text-sm mt-0.5 leading-snug">{a.content}</p>
                  <p className="text-[10px] text-[var(--color-text-dim)] mt-1">{a.date}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
