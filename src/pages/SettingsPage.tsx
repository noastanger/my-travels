import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProfileStore, SocialPlatform } from '../store/useProfileStore';
import { ConnectModal } from '../components/onboarding/ConnectModal';
import { InstagramIcon, TikTokIcon, FacebookIcon, GoogleMapsIcon } from '../components/onboarding/SocialIcons';
import { Button } from '../components/ui/Button';
import { ChevronLeft, Check, User, Mail, Pencil } from 'lucide-react';

interface ProfileFormValues {
  username: string;
  email: string;
}

const PLATFORMS: {
  platform: SocialPlatform;
  label: string;
  description: string;
  color: string;
  Icon: React.FC<{ size?: number }>;
}[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    description: 'Save posts & reels of places you want to visit',
    color: 'from-pink-600/20 to-purple-600/20 border-pink-500/30',
    Icon: InstagramIcon,
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    description: 'Bookmark travel videos & location content',
    color: 'from-slate-700/40 to-slate-800/40 border-white/10',
    Icon: TikTokIcon,
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    description: 'Import saved places & travel recommendations',
    color: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
    Icon: FacebookIcon,
  },
  {
    platform: 'google-maps',
    label: 'Google Maps',
    description: 'Sync your starred & saved places lists',
    color: 'from-red-600/20 to-orange-600/20 border-red-500/30',
    Icon: GoogleMapsIcon,
  },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { profile, setProfile, toggleConnection } = useProfileStore();
  const [activePlatform, setActivePlatform] = useState<SocialPlatform | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: { username: profile?.username ?? '', email: profile?.email ?? '' },
  });

  const connectedCount = profile?.connections.filter((c) => c.connected).length ?? 0;

  function onSaveProfile(data: ProfileFormValues) {
    setProfile(data);
    setEditingProfile(false);
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-4">
          <Button variant="ghost" className="h-8 gap-1.5 px-3 text-xs" onClick={() => navigate('/')}>
            <ChevronLeft size={14} /> Back
          </Button>
          <h1 className="text-sm font-bold text-white">Settings</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">

        {/* Profile section */}
        <section className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Profile</h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>

          <div className="px-5 py-4">
            {editingProfile ? (
              <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Username</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      className="w-full rounded-xl bg-slate-800 border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      {...register('username', { required: true })}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-400">Required</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      className="w-full rounded-xl bg-slate-800 border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      {...register('email', { required: true })}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">Required</p>}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="ghost" type="button" className="flex-1 text-xs" onClick={() => setEditingProfile(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 text-xs">Save changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-300">
                    {profile?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{profile?.username}</p>
                    <p className="text-xs text-slate-400">{profile?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Connected accounts section */}
        <section className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Connected accounts</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {connectedCount === 0
                  ? 'No accounts connected yet'
                  : `${connectedCount} of ${PLATFORMS.length} connected`}
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {PLATFORMS.map(({ platform, label, description, color, Icon }) => {
              const account = profile?.connections.find((c) => c.platform === platform);
              const isConnected = account?.connected ?? false;

              return (
                <div key={platform} className="flex items-center gap-4 px-5 py-4">
                  <Icon size={36} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{description}</p>
                  </div>

                  {isConnected ? (
                    <button
                      onClick={() => toggleConnection(platform)}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-colors cursor-pointer group"
                    >
                      <Check size={12} className="group-hover:hidden" />
                      <span className="group-hover:hidden">Connected</span>
                      <span className="hidden group-hover:inline">Disconnect</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActivePlatform(platform)}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {activePlatform && (
        <ConnectModal
          platform={activePlatform}
          open={true}
          onClose={() => setActivePlatform(null)}
          onConnected={(p) => {
            toggleConnection(p);
            setActivePlatform(null);
          }}
        />
      )}
    </div>
  );
}
