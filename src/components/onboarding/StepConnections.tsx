import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { SocialPlatform, ConnectedAccount } from '../../store/useProfileStore';
import { InstagramIcon, TikTokIcon, FacebookIcon, GoogleMapsIcon } from './SocialIcons';
import { ConnectModal } from './ConnectModal';

interface PlatformConfig {
  platform: SocialPlatform;
  label: string;
  description: string;
  color: string;
  icon: React.FC<{ size?: number }>;
}

const PLATFORMS: PlatformConfig[] = [
  {
    platform: 'instagram',
    label: 'Instagram',
    description: 'Save posts & reels of places you want to visit',
    color: 'from-pink-600/20 to-purple-600/20 border-pink-500/30',
    icon: InstagramIcon,
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    description: 'Bookmark travel videos & location content',
    color: 'from-slate-700/40 to-slate-800/40 border-white/10',
    icon: TikTokIcon,
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    description: 'Import saved places & travel recommendations',
    color: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
    icon: FacebookIcon,
  },
  {
    platform: 'google-maps',
    label: 'Google Maps',
    description: 'Sync your starred & saved places lists',
    color: 'from-red-600/20 to-orange-600/20 border-red-500/30',
    icon: GoogleMapsIcon,
  },
];

interface StepConnectionsProps {
  connections: ConnectedAccount[];
  onToggle: (platform: SocialPlatform) => void;
  onFinish: () => void;
}

export function StepConnections({ connections, onToggle, onFinish }: StepConnectionsProps) {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform | null>(null);

  const connectedCount = connections.filter((c) => c.connected).length;

  function handleConnected(platform: SocialPlatform) {
    onToggle(platform);
  }

  function handleDisconnect(platform: SocialPlatform) {
    onToggle(platform);
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {PLATFORMS.map(({ platform, label, description, color, icon: Icon }) => {
          const account = connections.find((c) => c.platform === platform);
          const isConnected = account?.connected ?? false;

          return (
            <div
              key={platform}
              className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-r p-4 transition-all ${color} ${
                isConnected ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div className="shrink-0">
                <Icon size={40} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
              </div>

              <div className="shrink-0">
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(platform)}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-colors cursor-pointer group"
                  >
                    <Check size={12} className="group-hover:hidden" />
                    <span className="group-hover:hidden">Connected</span>
                    <span className="hidden group-hover:inline">Disconnect</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActivePlatform(platform)}
                    className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 space-y-2">
        <Button onClick={onFinish} className="w-full py-3 text-sm font-semibold">
          {connectedCount > 0
            ? `Start exploring with ${connectedCount} account${connectedCount > 1 ? 's' : ''} →`
            : 'Skip for now →'}
        </Button>
        {connectedCount === 0 && (
          <p className="text-center text-xs text-slate-500">
            You can always connect accounts later from settings
          </p>
        )}
      </div>

      {/* Connect modal — opens for whichever platform was clicked */}
      {activePlatform && (
        <ConnectModal
          platform={activePlatform}
          open={true}
          onClose={() => setActivePlatform(null)}
          onConnected={handleConnected}
        />
      )}
    </div>
  );
}
