import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TravelDetailPage } from './pages/TravelDetailPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';
import { SettingsPage } from './pages/SettingsPage';
import { useProfileStore } from './store/useProfileStore';

function AppRoutes() {
  const onboardingComplete = useProfileStore((s) => s.profile?.onboardingComplete ?? false);

  return (
    <Routes>
      {/* OAuth callback — always accessible regardless of onboarding state */}
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

      {!onboardingComplete ? (
        <>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/travels/:id" element={<TravelDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
