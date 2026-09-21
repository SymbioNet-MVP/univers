import type { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/home/page';
import LandingRedirect from '@/pages/home/LandingRedirect';
import LocalizedLanding from '@/pages/home/LocalizedLanding';
import AuthPage from '@/pages/auth/page';
import OnboardingPage from '@/pages/onboarding/page';
import AppShell from '@/components/feature/AppShell';
import RequireAuth from '@/components/feature/RequireAuth';
import RequireOnboarded from '@/components/feature/RequireOnboarded';
import DashboardPage from '@/pages/app/dashboard/page';
import MatchesPage from '@/pages/app/matches/page';
import ChatPage from '@/pages/app/chat/page';
import CommunityPage from '@/pages/app/community/page';
import ProfilePage from '@/pages/app/profile/page';
import FounderInsightsPage from '@/pages/app/insights/page';
import ImprintPage from '@/pages/legal/ImprintPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingRedirect />,
  },
  {
    path: '/imprint',
    element: <ImprintPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/:lang',
    element: <LocalizedLanding />,
  },
  {
    path: '/login',
    element: <AuthPage mode="login" />,
  },
  {
    path: '/signup',
    element: <AuthPage mode="signup" />,
  },
  {
    path: '/onboarding',
    element: (
      <RequireAuth>
        <OnboardingPage />
      </RequireAuth>
    ),
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <RequireOnboarded>
          <AppShell />
        </RequireOnboarded>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'matches', element: <MatchesPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/:conversationId', element: <ChatPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'insights', element: <FounderInsightsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;