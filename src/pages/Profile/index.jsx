import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, ClipboardList, Shield, Trash2, RotateCcw } from 'lucide-react';
import { getApplications, deleteApplication } from '../../store/application-store';
import { getQuizResult, clearQuizResult } from '../../store/quiz-store';
import { getClubById } from '../../store/club-store';

const STATUS_MAP = {
  pending: { label: '审核中', cls: 'tag-pending' },
  approved: { label: '已通过', cls: 'tag-approved' },
  rejected: { label: '未通过', cls: 'tag-rejected' },
};

export default function Profile() {
  const navigate = useNavigate();
  const [apps, setApps] = useState(getApplications);
  const quizResult = getQuizResult();

  function removeApp(id) {
    deleteApplication(id);
    setApps(getApplications());
  }

  function retake() {
    clearQuizResult();
    navigate('/quiz');
  }

  return (
    <div className="animate-fade-in pb-4">
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">我的</h1>
        <p className="text-xs text-[var(--color-text-dim)] mt-1">管理你的报名和测试记录</p>
      </div>

      {/* 兴趣测试 */}
      <section className="px-5 mb-5">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
          <FlaskConical size={14} /> 兴趣测试
        </h2>
        {quizResult ? (
          <div className="card p-4">
            <p className="text-xs text-[var(--color-text-dim)] mb-3">
              测试时间：{new Date(quizResult.timestamp).toLocaleString('zh-CN')}
            </p>
            <div className="flex gap-2 mb-3">
              {Object.entries(quizResult.userVector)
                .sort(([, a], [, b]) => b - a)
                .filter(([, v]) => v > 0)
                .slice(0, 3)
                .map(([tag, score], i) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)] font-medium">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {tag} {score}分
                  </span>
                ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/quiz/result')} className="btn-primary text-xs !py-2 flex-1">查看匹配</button>
              <button onClick={retake} className="btn-outline text-xs !py-2 flex-1"><RotateCcw size={12} /> 重测</button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/quiz')} className="card p-4 w-full text-left active:scale-[0.98] transition-transform">
            <p className="text-sm font-semibold">还没做过兴趣测试</p>
            <p className="text-[11px] text-[var(--color-text-dim)] mt-1">完成测试，AI 为你匹配最适合的社团 →</p>
          </button>
        )}
      </section>

      {/* 报名记录 */}
      <section className="px-5 mb-5">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
          <ClipboardList size={14} /> 报名记录
          {apps.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-dim)]">{apps.length}</span>}
        </h2>
        {apps.length === 0 ? (
          <div className="card p-4 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">暂无报名记录</p>
            <button onClick={() => navigate('/explore')} className="text-xs text-[var(--color-primary)] mt-2 font-medium">去广场看看 →</button>
          </div>
        ) : (
          <div className="space-y-2">
            {apps.map((app) => {
              const club = getClubById(app.clubId);
              const st = STATUS_MAP[app.status] || STATUS_MAP.pending;
              return (
                <div key={app.id} className="card p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg bg-[var(--color-bg-secondary)] shrink-0">
                    {club?.logo || '📋'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{club?.name || app.clubId}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-dim)] mt-0.5">{new Date(app.createdAt).toLocaleDateString('zh-CN')}</p>
                  </div>
                  <button onClick={() => removeApp(app.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 管理端入口 */}
      <section className="px-5">
        <button onClick={() => navigate('/admin')} className="card p-4 w-full flex items-center gap-3 active:scale-[0.98] transition-transform text-left">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">管理端</p>
            <p className="text-[10px] text-[var(--color-text-dim)]">社团管理员入口</p>
          </div>
        </button>
      </section>
    </div>
  );
}
