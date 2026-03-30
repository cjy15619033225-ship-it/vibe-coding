import { useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronRight } from 'lucide-react';
import { getQuizResult, clearQuizResult } from '../../store/quiz-store';
import { getMatchResults } from '../../utils/match-algorithm';
import { INTEREST_TAGS, getPersonalityLabel } from '../../data/quiz-questions';

/** 纯 SVG 雷达图 */
function RadarChart({ vector, size = 260 }) {
  const tags = INTEREST_TAGS;
  const center = size / 2;
  const radius = size / 2 - 36;
  const maxVal = Math.max(...tags.map((t) => vector[t] || 0), 1);
  const count = tags.length;

  function polarToXY(index, value) {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }

  // 背景网格（3层）
  const gridLevels = [0.33, 0.66, 1];
  const gridPaths = gridLevels.map((level) => {
    const points = tags.map((_, i) => polarToXY(i, maxVal * level));
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  });

  // 数据多边形
  const dataPoints = tags.map((t, i) => polarToXY(i, vector[t] || 0));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // 标签位置
  const labelPoints = tags.map((t, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const r = radius + 22;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), tag: t };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      {/* Grid */}
      {gridPaths.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="var(--color-border)" strokeWidth="1" opacity={0.6} />
      ))}
      {/* Axes */}
      {tags.map((_, i) => {
        const p = polarToXY(i, maxVal);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--color-border)" strokeWidth="0.5" />;
      })}
      {/* Data polygon */}
      <polygon points={dataPath} fill="rgba(231, 76, 60, 0.15)" stroke="var(--color-accent)" strokeWidth="2" />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--color-accent)" />
      ))}
      {/* Labels */}
      {labelPoints.map((p) => (
        <text
          key={p.tag}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
          fontWeight="500"
        >
          {p.tag}
        </text>
      ))}
    </svg>
  );
}

export default function QuizResult() {
  const navigate = useNavigate();
  const quizData = getQuizResult();

  if (!quizData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">还没有测试结果</p>
        <button onClick={() => navigate('/quiz', { replace: true })} className="btn-primary">开始测试</button>
      </div>
    );
  }

  const { userVector } = quizData;
  const { results } = getMatchResults(quizData.answers);
  const personality = getPersonalityLabel(userVector);

  function retake() {
    clearQuizResult();
    navigate('/quiz', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] animate-fade-in">
      {/* ── Personality Label Hero ── */}
      <section className="bg-white rounded-b-3xl px-5 pt-12 pb-6 shadow-sm">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] mb-3 animate-bounce-in text-3xl">
            {personality.emoji}
          </div>
          <h1 className="text-2xl font-bold animate-fade-in-up delay-1">{personality.title}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed animate-fade-in-up delay-2">
            {personality.desc}
          </p>
        </div>

        {/* ── Radar Chart ── */}
        <div className="animate-fade-in-up delay-3 mx-auto rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #fff1f0 0%, #fef3e2 30%, #e8f8f0 60%, #eef0ff 100%)' }}
        >
          <RadarChart vector={userVector} />
        </div>
      </section>

      {/* ── Top Dimensions ── */}
      <section className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 animate-fade-in-up delay-4">
        <h2 className="text-sm font-bold mb-3">兴趣维度 TOP 3</h2>
        <div className="space-y-2.5">
          {INTEREST_TAGS
            .map((t) => ({ tag: t, score: userVector[t] || 0 }))
            .sort((a, b) => b.score - a.score)
            .filter((t) => t.score > 0)
            .slice(0, 3)
            .map(({ tag, score }, i) => {
              const maxScore = INTEREST_TAGS.reduce((mx, t) => Math.max(mx, userVector[t] || 0), 1);
              return (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-sm w-5">{['🥇', '🥈', '🥉'][i]}</span>
                  <span className="text-sm font-medium w-12">{tag}</span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-700"
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-text-dim)] w-8 text-right">{Math.round(score)}</span>
                </div>
              );
            })}
        </div>
      </section>

      {/* ── Recommended Clubs (Horizontal Scroll) ── */}
      <section className="mt-4 animate-fade-in-up delay-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-sm font-bold">推荐社团</h2>
          <span className="text-xs text-[var(--color-text-dim)]">左右滑动查看</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none">
          {results.slice(0, 8).map(({ club, score }, i) => {
            const pct = Math.round(score * 100);
            return (
              <button
                key={club.id}
                onClick={() => navigate(`/club/${club.id}`)}
                className="min-w-[200px] snap-start shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm text-left active:scale-[0.97] transition-transform"
              >
                <div className="relative h-28">
                  <img src={club.cover} alt={club.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {i < 3 && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white">
                      TOP {i + 1}
                    </span>
                  )}
                  {/* Match ring */}
                  <div className="absolute bottom-2 right-2">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="3"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset="25" strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                      />
                      <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="700">
                        {pct}
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{club.logo}</span>
                    <p className="text-sm font-semibold truncate">{club.name}</p>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-dim)] mt-0.5 truncate">{club.slogan}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── All Rankings ── */}
      <section className="mx-4 mt-4 mb-4 bg-white rounded-2xl shadow-sm p-4">
        <h2 className="text-sm font-bold mb-3">完整匹配排名</h2>
        <div className="space-y-2">
          {results.map(({ club, score }, i) => {
            const pct = Math.round(score * 100);
            return (
              <button
                key={club.id}
                onClick={() => navigate(`/club/${club.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] text-left active:scale-[0.98] transition-transform"
              >
                <span className="w-6 text-center text-xs font-bold text-[var(--color-text-dim)]">{i + 1}</span>
                <span className="text-lg">{club.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{club.name}</p>
                </div>
                <span className={`text-sm font-bold ${i < 3 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}`}>
                  {pct}%
                </span>
                <ChevronRight size={14} className="text-[var(--color-text-dim)] shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="px-4 pb-8 flex gap-3">
        <button onClick={retake} className="btn-outline flex-1 text-sm">
          <RotateCcw size={14} /> 重新测试
        </button>
        <button onClick={() => navigate('/explore')} className="btn-primary flex-1 text-sm">
          浏览广场
        </button>
      </div>
    </div>
  );
}
