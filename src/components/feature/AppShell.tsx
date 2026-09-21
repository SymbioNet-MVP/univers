import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { supabase } from '@/lib/supabase';
import Avatar from '@/components/base/Avatar';
import BrandLogo from '@/components/feature/BrandLogo';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';
import ThemeToggle from '@/components/feature/ThemeToggle';
import ActivityCenter from '@/components/feature/ActivityCenter';

const NAV_ITEMS = [
  { to: '/app', key: 'dashboard', icon: 'ri-layout-grid-line', end: true },
  { to: '/app/matches', key: 'matches', icon: 'ri-user-heart-line', end: false },
  { to: '/app/chat', key: 'chat', icon: 'ri-chat-3-line', end: false },
  { to: '/app/community', key: 'community', icon: 'ri-community-line', end: false },
  { to: '/app/profile', key: 'profile', icon: 'ri-user-line', end: false },
];

const INSIGHTS_ITEM = {
  to: '/app/insights',
  key: 'insights',
  icon: 'ri-line-chart-line',
  end: false,
};

export default function AppShell() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = profile?.is_founder ? [...NAV_ITEMS, INSIGHTS_ITEM] : NAV_ITEMS;

  // Private area: keep it out of the index, but give each view a real title.
  const section = (() => {
    const path = location.pathname.replace(/\/+$/, '');
    if (path.endsWith('/matches')) return 'matches';
    if (path.includes('/chat')) return 'chat';
    if (path.endsWith('/community')) return 'community';
    if (path.endsWith('/profile')) return 'profile';
    return 'dashboard';
  })();

  useSeo({
    title: t(`seo.pages.${section}.title`),
    description: t(`seo.pages.${section}.description`),
    robots: 'noindex,nofollow',
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
      isActive
        ? 'bg-primary-500 text-background-50'
        : 'text-foreground-700 hover:bg-background-100 hover:text-foreground-950'
    }`;

  return (
    <div className="min-h-screen bg-background-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 flex-col border-r border-background-200 bg-background-50">
        <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-background-200">
          <BrandLogo />
          <ActivityCenter />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              <span className="w-5 h-5 flex items-center justify-center">
                <i className={`${item.icon} text-lg`}></i>
              </span>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-background-200 p-3 space-y-2">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar name={profile?.full_name} url={profile?.avatar_url} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground-950">
                {profile?.full_name || user?.email}
              </p>
              <p className="truncate text-xs text-foreground-500">
                {profile?.field_of_study || t('common.optional')}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 px-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground-700 hover:bg-background-100"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-logout-box-r-line text-lg"></i>
            </span>
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-background-200 bg-background-50 px-4">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-1">
          <ActivityCenter />
          <ThemeToggle compact />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-md text-foreground-500"
            aria-label={t('nav.logout')}
          >
            <i className="ri-logout-box-r-line"></i>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="md:pl-64 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-background-200 bg-background-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium cursor-pointer ${
                isActive ? 'text-primary-600' : 'text-foreground-500'
              }`
            }
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icon} text-lg`}></i>
            </span>
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}