import { useEffect, useState } from 'react';

/**
 * This page lives at /oauth/callback.
 * The OAuth provider redirects here after the user approves (or denies) access.
 * We read the result from the URL, post a message to the opener, then close.
 */
export function OAuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const code = params.get('code');
    const token = hashParams.get('access_token') || params.get('access_token');
    const error = params.get('error');
    const returnedState = params.get('state');

    const savedState = sessionStorage.getItem('oauth_state');
    const platform = sessionStorage.getItem('oauth_platform') as string;

    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_platform');

    if (error) {
      setStatus('error');
      setMessage(`Connection failed: ${error}`);
      setTimeout(() => {
        window.opener?.postMessage(
          { type: 'oauth_callback', platform, error },
          window.location.origin
        );
        window.close();
      }, 1500);
      return;
    }

    if (returnedState !== savedState) {
      setStatus('error');
      setMessage('Security check failed. Please try again.');
      setTimeout(() => {
        window.opener?.postMessage(
          { type: 'oauth_callback', platform, error: 'state_mismatch' },
          window.location.origin
        );
        window.close();
      }, 1500);
      return;
    }

    if (code || token) {
      setStatus('success');
      setMessage('Connected! Closing…');
      setTimeout(() => {
        window.opener?.postMessage(
          { type: 'oauth_callback', platform, code, token },
          window.location.origin
        );
        window.close();
      }, 800);
      return;
    }

    setStatus('error');
    setMessage('No authorisation code received.');
    setTimeout(() => {
      window.opener?.postMessage(
        { type: 'oauth_callback', platform, error: 'no_code' },
        window.location.origin
      );
      window.close();
    }, 1500);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="text-center space-y-4">
        {status === 'processing' && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-white font-medium">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-2xl">
              ✓
            </div>
            <p className="text-white font-medium">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-2xl">
              ✕
            </div>
            <p className="text-white font-medium">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
