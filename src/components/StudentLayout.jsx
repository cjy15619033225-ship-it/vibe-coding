import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, FlaskConical, Compass, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/quiz', icon: FlaskConical, label: '测试' },
  { to: '/explore', icon: Compass, label: '广场' },
  { to: '/profile', icon: User, label: '我的' },
];

export default function StudentLayout() {
  const { pathname } = useLocation();
  const hideTabs = pathname.startsWith('/club/');

  return (
    <div className="min-h-screen max-w-[430px] mx-auto relative bg-[var(--color-bg)]" style={{ paddingBottom: hideTabs ? 0 : 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <Outlet />
      {!hideTabs && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[var(--color-nav-bg)] backdrop-blur-lg border-t border-[var(--color-border)] z-50 safe-bottom">
          <div className="flex items-center justify-around h-14">
            {tabs.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 text-[10px] transition-colors duration-200 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-dim)]'}`
                }
              >
                <Icon size={22} strokeWidth={isActive => isActive ? 2 : 1.5} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
