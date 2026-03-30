import { useState } from 'react';
import { getApplications, updateApplicationStatus } from '../../../store/application-store';
import { getClubById } from '../../../store/club-store';
import { Check, X } from 'lucide-react';

const FILTERS = ['全部', 'pending', 'approved', 'rejected'];
const FILTER_LABELS = { 全部: '全部', pending: '待审核', approved: '已通过', rejected: '未通过' };
const STATUS_MAP = {
  pending: { label: '待审核', cls: 'tag-pending' },
  approved: { label: '已通过', cls: 'tag-approved' },
  rejected: { label: '未通过', cls: 'tag-rejected' },
};

export default function Applications() {
  const [apps, setApps] = useState(getApplications);
  const [filter, setFilter] = useState('全部');
  const filtered = filter === '全部' ? apps : apps.filter((a) => a.status === filter);

  function handleAction(id, status) {
    updateApplicationStatus(id, status);
    setApps(getApplications());
  }

  return (
    <div className="animate-fade-in pb-4">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">报名审核</h1>
        <p className="text-xs text-[var(--color-text-dim)] mt-1">共 {apps.length} 条报名</p>
      </div>

      <div className="flex gap-2 px-5 mt-2 mb-4 overflow-x-auto scrollbar-none">
        {FILTERS.map((f) => {
          const count = f === '全部' ? apps.length : apps.filter((a) => a.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full transition-all font-medium
                ${filter === f ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
            >
              {FILTER_LABELS[f]} ({count})
            </button>
          );
        })}
      </div>

      <div className="px-5 space-y-3">
        {filtered.length === 0 && <p className="text-center text-sm text-[var(--color-text-dim)] py-16">暂无报名记录</p>}
        {filtered.map((app) => {
          const club = getClubById(app.clubId);
          const st = STATUS_MAP[app.status] || STATUS_MAP.pending;
          return (
            <div key={app.id} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-base bg-[var(--color-bg-secondary)]">
                    {club?.logo || '📋'}
                  </div>
                  <span className="text-sm font-semibold">{club?.name || app.clubId}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <p><span className="text-[var(--color-text-dim)]">姓名：</span>{app.name}</p>
                <p><span className="text-[var(--color-text-dim)]">手机：</span>{app.phone}</p>
                <p><span className="text-[var(--color-text-dim)]">专业：</span>{app.major}</p>
                <p><span className="text-[var(--color-text-dim)]">年级：</span>{app.grade}</p>
              </div>
              {app.intro && <p className="text-xs text-[var(--color-text-secondary)] mt-2 line-clamp-2">{app.intro}</p>}
              {app.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAction(app.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-2.5 rounded-xl bg-green-50 text-green-600 font-medium active:scale-[0.97] transition-transform">
                    <Check size={14} /> 通过
                  </button>
                  <button onClick={() => handleAction(app.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-2.5 rounded-xl bg-red-50 text-red-500 font-medium active:scale-[0.97] transition-transform">
                    <X size={14} /> 拒绝
                  </button>
                </div>
              )}
              <p className="text-[10px] text-[var(--color-text-dim)] mt-2">{new Date(app.createdAt).toLocaleString('zh-CN')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
