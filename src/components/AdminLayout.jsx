import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Settings } from 'lucide-react';

const tabs = [
  { to: '/admin', icon: LayoutDashboard, label: '工作台' },
  { to: '/admin/applications', icon: FileText, label: '报名' },
  { to: '/admin/stats', icon: BarChart3, label: '数据' },
  { to: '/admin/club', icon: Settings, label: '社团' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen max-w-[430px] mx-auto relative bg-[var(--color-bg)]" style={{ paddingBottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <Outlet />
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[var(--color-nav-bg)] backdrop-blur-lg border-t border-[var(--color-border)] z-50 safe-bottom">
        <div className="flex items-center justify-around h-14">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-[10px] transition-colors duration-200 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-dim)]'}`
              }
            >
              <Icon size={22} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
