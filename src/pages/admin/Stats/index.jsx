import { getApplications } from '../../../store/application-store';
import { getClubs } from '../../../store/club-store';

export default function Stats() {
  const apps = getApplications();
  const clubs = getClubs();

  const pending = apps.filter((a) => a.status === 'pending').length;
  const approved = apps.filter((a) => a.status === 'approved').length;
  const rejected = apps.filter((a) => a.status === 'rejected').length;

  const clubApps = clubs.map((c) => {
    const count = apps.filter((a) => a.clubId === c.id).length;
    return { ...c, appCount: count };
  }).sort((a, b) => b.appCount - a.appCount);
  const maxAppCount = clubApps[0]?.appCount || 1;

  const gradeMap = {};
  apps.forEach((a) => { gradeMap[a.grade] = (gradeMap[a.grade] || 0) + 1; });
  const grades = Object.entries(gradeMap).sort(([, a], [, b]) => b - a);
  const maxGrade = grades[0]?.[1] || 1;

  return (
    <div className="animate-fade-in pb-4">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">数据看板</h1>
        <p className="text-xs text-[var(--color-text-dim)] mt-1">招新数据统计</p>
      </div>

      {/* 状态分布 */}
      <section className="px-5 mt-4 mb-6">
        <div className="card p-4">
          <h2 className="text-sm font-semibold mb-3">报名状态</h2>
          <div className="flex items-end gap-4 h-28">
            {[
              { label: '待审核', value: pending, bg: 'bg-amber-400' },
              { label: '已通过', value: approved, bg: 'bg-green-500' },
              { label: '未通过', value: rejected, bg: 'bg-red-400' },
            ].map(({ label, value, bg }) => {
              const h = apps.length > 0 ? (value / apps.length) * 100 : 0;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold">{value}</span>
                  <div className={`w-full rounded-lg transition-all duration-500 ${bg}`} style={{ height: `${Math.max(h, 4)}%` }} />
                  <span className="text-[10px] text-[var(--color-text-dim)]">{label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-[var(--color-text-dim)] mt-3">总计 {apps.length} 条</p>
        </div>
      </section>

      {/* 社团排行 */}
      <section className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">社团报名排行</h2>
        <div className="space-y-2">
          {clubApps.map((c) => (
            <div key={c.id} className="card px-4 py-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium">{c.logo} {c.name}</span>
                <span className="text-[var(--color-text-dim)]">{c.appCount} 人</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
                <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${maxAppCount > 0 ? (c.appCount / maxAppCount) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 年级分布 */}
      {grades.length > 0 && (
        <section className="px-5 mb-6">
          <h2 className="text-sm font-semibold mb-3">年级分布</h2>
          <div className="card p-4 space-y-3">
            {grades.map(([grade, count]) => (
              <div key={grade}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{grade}</span>
                  <span className="text-[var(--color-text-dim)]">{count} 人</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${(count / maxGrade) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
