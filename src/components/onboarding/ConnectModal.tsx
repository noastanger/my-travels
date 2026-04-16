import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { SocialPlatform } from '../../store/useProfileStore';
import { openOAuthPopup } from '../../lib/oauth';
import { InstagramIcon, TikTokIcon, FacebookIcon, GoogleMapsIcon } from './SocialIcons';

interface PlatformMeta {
  label: string;
  Icon: React.FC<{ size?: number }>;
  color: string;
  tagline: string;
  permissions: string[];
  setupUrl: string;
  envVar: string;
}

const PLATFORM_META: Record<SocialPlatform, PlatformMeta> = {
  instagram: {
    label: 'Instagram',
    Icon: InstagramIcon,
    color: 'text-pink-400',
    tagline: 'Save posts & reels of places you want to visit',
    permissions: ['View your basic profile', 'Read your saved posts & tagged locations'],
    setupUrl: 'https://developers.facebook.com/apps/',
    envVar: 'VITE_INSTAGRAM_APP_ID',
  },
  tiktok: {
    label: 'TikTok',
    Icon: TikTokIcon,
    color: 'text-white',
    tagline: 'Bookmark travel videos & location content',
    permissions: ['View your basic profile', 'Browse your liked & bookmarked videos'],
    setupUrl: 'https://developers.tiktok.com/',
    envVar: 'VITE_TIKTOK_CLIENT_KEY',
  },
  facebook: {
    label: 'Facebook',
    Icon: FacebookIcon,
    color: 'text-blue-400',
    tagline: 'Import saved places & travel recommendations',
    permissions: ['View your public profile', 'Access your saved places'],
    setupUrl: 'https://developers.facebook.com/apps/',
    envVar: 'VITE_FACEBOOK_APP_ID',
  },
  'google-maps': {
    label: 'Google Maps',
    Icon: GoogleMapsIcon,
    color: 'text-red-400',
    tagline: 'Sync your starred & saved places lists',
    permissions: ['View your Google account profile', 'Read your saved places & lists'],
    setupUrl: 'https://console.cloud.google.com/',
    envVar: 'VITE_GOOGLE_CLIENT_ID',
  },
};

type ConnectState = 'idle' | 'connecting' | 'success' | 'error';

interface ConnectModalProps {
  platform: SocialPlatform;
  open: boolean;
  onClose: () => void;
  onConnected: (platform: SocialPlatform) => void;
}

export function ConnectModal({ platform, open, onClose, onConnected }: ConnectModalProps) {
  const [connectState, setConnectState] = useState<ConnectState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const meta = PLATFORM_META[platform];
  const { label, Icon, tagline, permissions, setupUrl, envVar } = meta;

  // Check if the client ID is configured
  const envVarMap: Record<string, string | undefined> = {
    VITE_INSTAGRAM_APP_ID: import.meta.env.VITE_INSTAGRAM_APP_ID,
    VITE_TIKTOK_CLIENT_KEY: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
    VITE_FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  };
  const isConfigured = !!envVarMap[envVar];

  async function handleConnect() {
    setConnectState('connecting');
    setErrorMsg('');

    const result = await openOAuthPopup(platform);

    if (result.error === 'popup_closed') {
      setConnectState('idle');
      return;
    }

    if (result.error) {
      setConnectState('error');
      const messages: Record<string, string> = {
        missing_client_id: `Add ${envVar} to your .env file to enable this connection.`,
        popup_blocked: 'Your browser blocked the popup. Please allow popups for this site.',
        state_mismatch: 'Security check failed. Please try again.',
        no_code: 'No authorisation code received from the provider.',
      };
      setErrorMsg(messages[result.error] ?? `Connection failed: ${result.error}`);
      return;
    }

    setConnectState('success');
    setTimeout(() => {
      onConnected(platform);
      onClose();
      setConnectState('idle');
    }, 1000);
  }

  function handleClose() {
    if (connectState === 'connecting') return;
    setConnectState('idle');
    setErrorMsg('');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Connect ${label}`}>
      <div className="space-y-5">
        {/* Platform header */}
        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
          <Icon size={48} />
          <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{tagline}</p>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            This will allow My Travels to:
          </p>
          <ul className="space-y-1.5">
            {permissions.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Not configured warning */}
        {!isConfigured && (
          <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-300 space-y-1">
              <p className="font-medium">API credentials required</p>
              <p>
                Add <code className="bg-white/10 px-1 rounded">{envVar}</code> to your{' '}
                <code className="bg-white/10 px-1 rounded">.env</code> file.
              </p>
              <a
                href={setupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                Get credentials <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        {/* Error message */}
        {connectState === 'error' && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            loading={connectState === 'connecting'}
            onClick={handleConnect}
          >
            {connectState === 'success'
              ? '✓ Connected!'
              : connectState === 'connecting'
              ? `Connecting to ${label}…`
              : `Connect ${label}`}
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500">
          You can disconnect at any time from your profile settings.
        </p>
      </div>
    </Modal>
  );
}
