import { SocialPlatform } from '../store/useProfileStore';

// ─── PKCE helpers ────────────────────────────────────────────────────────────

function randomBase64(byteCount: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteCount));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sha256Base64(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// ─── Platform configs ─────────────────────────────────────────────────────────

const REDIRECT_URI = `${window.location.origin}/oauth/callback`;

export interface OAuthConfig {
  platform: SocialPlatform;
  label: string;
  authUrl: string;
  clientId: string;
  scope: string;
  usePKCE: boolean;
  responseType: 'code' | 'token';
  extraParams?: Record<string, string>;
}

export const OAUTH_CONFIGS: Record<SocialPlatform, OAuthConfig> = {
  google_maps: {
    platform: 'google-maps',
    label: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
    scope: 'openid email profile',
    usePKCE: true,
    responseType: 'code',
    extraParams: { access_type: 'online', prompt: 'select_account' },
  } as OAuthConfig,
  instagram: {
    platform: 'instagram',
    label: 'Instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    clientId: import.meta.env.VITE_INSTAGRAM_APP_ID ?? '',
    scope: 'instagram_business_basic',
    usePKCE: false,
    responseType: 'code',
  },
  tiktok: {
    platform: 'tiktok',
    label: 'TikTok',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    clientId: import.meta.env.VITE_TIKTOK_CLIENT_KEY ?? '',
    scope: 'user.info.basic,video.list',
    usePKCE: true,
    responseType: 'code',
  },
  facebook: {
    platform: 'facebook',
    label: 'Facebook',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID ?? '',
    scope: 'public_profile,email',
    usePKCE: false,
    responseType: 'code',
  },
};

// Fix the google-maps key
(OAUTH_CONFIGS as Record<string, OAuthConfig>)['google-maps'] = {
  ...(OAUTH_CONFIGS as Record<string, OAuthConfig>)['google_maps'],
  platform: 'google-maps',
};

// ─── OAuth popup ──────────────────────────────────────────────────────────────

export interface OAuthResult {
  platform: SocialPlatform;
  code?: string;
  token?: string;
  error?: string;
}

export async function openOAuthPopup(platform: SocialPlatform): Promise<OAuthResult> {
  const config = OAUTH_CONFIGS[platform] ?? (OAUTH_CONFIGS as Record<string, OAuthConfig>)[platform];
  if (!config || !config.clientId) {
    return { platform, error: 'missing_client_id' };
  }

  const state = randomBase64(16);
  const params: Record<string, string> = {
    client_id: config.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: config.responseType,
    scope: config.scope,
    state,
    ...config.extraParams,
  };

  let codeVerifier: string | undefined;
  if (config.usePKCE) {
    codeVerifier = randomBase64(32);
    const codeChallenge = await sha256Base64(codeVerifier);
    params.code_challenge = codeChallenge;
    params.code_challenge_method = 'S256';
    sessionStorage.setItem('oauth_code_verifier', codeVerifier);
  }

  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_platform', platform);

  const url = `${config.authUrl}?${new URLSearchParams(params).toString()}`;

  const width = 520;
  const height = 660;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    'oauth_popup',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
  );

  if (!popup) {
    return { platform, error: 'popup_blocked' };
  }

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'oauth_callback') return;
      window.removeEventListener('message', handler);
      clearInterval(pollTimer);
      resolve(event.data as OAuthResult);
    };

    window.addEventListener('message', handler);

    // Detect if user closed the popup manually
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer);
        window.removeEventListener('message', handler);
        resolve({ platform, error: 'popup_closed' });
      }
    }, 500);
  });
}
