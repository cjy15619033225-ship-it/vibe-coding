import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, Send } from 'lucide-react';
import { getClubs } from '../../store/club-store';
import { getLikes, toggleLike, getComments } from '../../store/social-store';

const ALL = '全部';

export default function Explore() {
  const navigate = useNavigate();
  const clubs = getClubs();
  const categories = useMemo(() => {
    const set = new Set(clubs.map((c) => c.category));
    return [ALL, ...set];
  }, [clubs]);

  const [activeCategory, setActiveCategory] = useState(ALL);
  const [keyword, setKeyword] = useState('');
  const [, forceUpdate] = useState(0);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const matchCat = activeCategory === ALL || c.category === activeCategory;
      const kw = keyword.trim().toLowerCase();
      const matchKw = !kw || c.name.toLowerCase().includes(kw) || c.tags.some((t) => t.includes(kw));
      return matchCat && matchKw;
    });
  }, [clubs, activeCategory, keyword]);

  function handleLike(e, clubId) {
    e.stopPropagation();
    toggleLike(clubId);
    forceUpdate((n) => n + 1);
  }

  return (
    <div className="animate-fade-in bg-[var(--color-bg)]">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">社团广场</h1>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="bg-[var(--color-bg-secondary)] rounded-xl flex items-center gap-2 px-3 h-10">
          <Search size={16} className="text-[var(--color-text-dim)] shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索社团…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-[var(--color-text-dim)]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full transition-all font-medium
              ${activeCategory === cat
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-[var(--color-text-dim)] py-16">没有找到匹配的社团</p>
        )}
        {filtered.map((club) => {
          const likes = getLikes(club.id);
          const comments = getComments(club.id);
          const topComments = comments.slice(-2);

          return (
            <div key={club.id} className="border-b border-[var(--color-border)]">
              {/* 头部：头像 + 名称 */}
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg bg-[var(--color-bg-secondary)] shrink-0">
                  {club.logo}
                </div>
                <div className="flex-1 min-w-0">
                             <p className="text-sm font-semibold">{club.name}</p>
                  <p className="text-[11px] text-[var(--color-text-dim)]">{club.category}</p>
                </div>
                {club.recruiting && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium">招新中</span>
                )}
              </div>

              {/* 图片 */}
              <button
                onClick={() => navigate(`/club/${club.id}`)}
                className="w-full block px-4"
              >
                <img
                  src={club.cover}
                  alt={club.name}
                  className="w-full aspect-[16/9] object-cover rounded-2xl"
                  loading="lazy"
                />
              </button>

              {/* 互动栏 */}
              <div className="px-5 pt-3 pb-1">
                <div className="flex items-center gap-5">
                  <button onClick={(e) => handleLike(e, club.id)} className="flex items-center gap-1.5 active:scale-90 transition-transform">
                    <Heart size={22} strokeWidth={1.5} className={likes.liked ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : ''} />
                  </button>
                  <button onClick={() => navigate(`/club/${club.id}`)} className="flex items-center gap-1.5">
                    <MessageCircle size={22} strokeWidth={1.5} />
                  </button>
                  <button className="flex items-center gap-1.5">
                    <Send size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-xs font-semibold mt-2">{likes.count.toLocaleString()} 次赞</p>
              </div>

              {/* 简介 */}
              <div className="px-5 pb-1">
                <p className="text-sm">
                  <span className="font-semibold">{club.name}</span>{' '}
                  <span className="text-[var(--color-text-secondary)]">{club.slogan}</span>
                </p>
              </div>

              {/* 评论预览 */}
              {topComments.length > 0 && (
                <div className="px-5 pb-1">
                  {comments.length > 2 && (
                    <button
                      onClick={() => navigate(`/club/${club.id}`)}
                      className="text-xs text-[var(--color-text-dim)] mb-1"
                    >
                      查看全部 {comments.length} 条评论
                    </button>
                  )}
                  {topComments.map((c) => (
                    <p key={c.id} className="text-sm leading-snug mb-0.5">
                      <span className="font-semibold">{c.user}</span>{' '}
                      <span className="text-[var(--color-text-secondary)]">{c.content}</span>
                    </p>
                  ))}
                </div>
              )}

              <div className="px-5 pb-3 pt-1">
                <p className="text-[10px] text-[var(--color-text-dim)] uppercase">
                  {club.activities[0]?.date || '招新进行中'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
