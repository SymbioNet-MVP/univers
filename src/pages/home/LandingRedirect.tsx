import { Navigate } from 'react-router-dom';
import { detectInitialLang } from '@/lib/lang';

/** Sends the root URL to the detected language landing route (/en or /de). */
export default function LandingRedirect() {
  return <Navigate to={`/${detectInitialLang()}`} replace />;
}