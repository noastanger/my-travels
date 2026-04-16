import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore, SocialPlatform } from '../store/useProfileStore';
import { StepProfile } from '../components/onboarding/StepProfile';
import { StepConnections } from '../components/onboarding/StepConnections';

const STEPS = ['profile', 'connections'] as const;
type Step = (typeof STEPS)[number];

const stepLabels: Record<Step, string> = {
  profile: 'Your profile',
  connections: 'Connect accounts',
};

export function OnboardingPage() {
  const [step, setStep] = useState<Step>('profile');
  const { profile, setProfile, toggleConnection, completeOnboarding } = useProfileStore();
  const navigate = useNavigate();

  const currentIndex = STEPS.indexOf(step);

  function handleProfileNext(data: { username: string; email: string }) {
    setProfile(data);
    setStep('connections');
  }

  function handleToggle(platform: SocialPlatform) {
    toggleConnection(platform);
  }

  function handleFinish() {
    completeOnboarding();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🌍</div>
          <h1 className="text-2xl font-bold text-white">My Travels</h1>
          <p className="mt-1 text-sm text-slate-400">Your personal travel map</p>
        </div>

        {/* Step card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i < currentIndex
                      ? 'bg-indigo-500 text-white'
                      : i === currentIndex
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/20'
                      : 'bg-white/10 text-slate-500'
                  }`}
                >
                  {i < currentIndex ? '✓' : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    i === currentIndex ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {stepLabels[s]}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 ${i < currentIndex ? 'bg-indigo-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step title */}
          <div className="mb-6">
            {step === 'profile' && (
              <>
                <h2 className="text-xl font-bold text-white">Welcome! Let's get you set up</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Tell us a bit about yourself to personalise your experience.
                </p>
              </>
            )}
            {step === 'connections' && (
              <>
                <h2 className="text-xl font-bold text-white">Connect your accounts</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Link your social apps so saved posts automatically appear on your travel maps.
                </p>
              </>
            )}
          </div>

          {/* Step content */}
          {step === 'profile' && (
            <StepProfile
              defaultValues={{ username: profile?.username, email: profile?.email }}
              onNext={handleProfileNext}
            />
          )}
          {step === 'connections' && (
            <StepConnections
              connections={
                profile?.connections ?? [
                  { platform: 'instagram', connected: false },
                  { platform: 'tiktok', connected: false },
                  { platform: 'facebook', connected: false },
                  { platform: 'google-maps', connected: false },
                ]
              }
              onToggle={handleToggle}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>
    </div>
  );
}
