import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TravelDetailPage } from './pages/TravelDetailPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { useProfileStore } from './store/useProfileStore';

function AppRoutes() {
  const onboardingComplete = useProfileStore((s) => s.profile?.onboardingComplete ?? false);

  if (!onboardingComplete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/travels/:id" element={<TravelDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
