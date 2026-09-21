import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/base/Spinner';

export default function RequireOnboarded({ children }: { children: ReactNode }) {
  const { profile, profileLoading } = useAuth();

  if (profileLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50 text-foreground-500">
        <span className="w-8 h-8 flex items-center justify-center">
          <Spinner className="text-2xl" />
        </span>
      </div>
    );
  }

  if (!profile || !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}