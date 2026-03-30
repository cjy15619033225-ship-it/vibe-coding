import { useNavigate } from 'react-router-dom';
import { ClipboardList, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import { getApplications } from '../../../store/application-store';
import { getClubs } from '../../../store/club-store';

export default function Dashboard() {
  const navigate = useNavigate();
  const apps = getApplications();
  const clubs = getClubs();

  const pending = apps.filter((a) => a.status === 'pending').length;
  const approved = apps.filter((a) => a.status === 'approved').length;
  const rejected = apps.filter((a) => a.status === 'rejected').length;

  const stats = [
    { label: '总报名', value: apps.length, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: '待审核', value: pending, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: '已通过', value: approved, bg: 'bg-green-50', text: 'text-green-600' },
    { label: '未通过', value: rejected, bg: 'bg-red-50', text: 'text-red-500' },
  ];

  const shortcuts = [
    { label: '报名审核', icon: ClipboardList, to: '/admin/applications', desc: `${pending} 条待处理` },
    { label: '数据看板', icon: BarChart3, to: '/admin/stats', desc: '查看统计' },
    { label: '社团管理', icon: Settings, to: '/admin/club', desc: `${clubs.length} 个社团` },
  ];

  return (
    <div className="animate-fade-in pb-4">
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">管理工作台</h1>
          <p className="text-xs text-[var(--color-text-dim)] mt-1">社团招新管理中心</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-outline text-xs !py-1.5 !px-3">
          <ArrowLeft size={14} /> 学生端
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 mt-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.bg}`}>
            <p className="text-[10px] text-[var(--color-text-secondary)]">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="px-5 space-y-3">
        {shortcuts.map(({ label, icon: Icon, to, desc }) => (
          <button key={to} onClick={() => navigate(to)} className="w-full card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-[10px] text-[var(--color-text-dim)]">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
