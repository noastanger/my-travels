export type PostPlatform = 'instagram' | 'tiktok' | 'youtube' | 'unknown';

export interface PostPreview {
  url: string;
  platform: PostPlatform;
  title?: string;
  authorName?: string;
  thumbnailUrl?: string;
  html?: string;
  locationName?: string;
  error?: string;
}

// ─── URL detection ────────────────────────────────────────────────────────────

export function detectPlatform(url: string): PostPlatform {
  try {
    const { hostname } = new URL(url);
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('tiktok.com')) return 'tiktok';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export function parseUrls(raw: string): string[] {
  return raw
    .split(/[\n,\s]+/)
    .map((u) => u.trim())
    .filter((u) => {
      try {
        new URL(u);
        return true;
      } catch {
        return false;
      }
    });
}

// ─── oEmbed fetchers ──────────────────────────────────────────────────────────

async function fetchTikTokPreview(url: string): Promise<PostPreview> {
  try {
    const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('TikTok oEmbed failed');
    const data = await res.json();
    return {
      url,
      platform: 'tiktok',
      title: data.title,
      authorName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      html: data.html,
    };
  } catch {
    return { url, platform: 'tiktok', error: 'Could not load preview' };
  }
}

async function fetchInstagramPreview(url: string): Promise<PostPreview> {
  // Try Instagram oEmbed with app access token if available
  const appId = import.meta.env.VITE_INSTAGRAM_APP_ID;
  const clientToken = import.meta.env.VITE_INSTAGRAM_CLIENT_TOKEN;

  if (appId && clientToken) {
    try {
      const accessToken = `${appId}|${clientToken}`;
      const endpoint = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${accessToken}&fields=thumbnail_url,title,author_name,html`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        return {
          url,
          platform: 'instagram',
          title: data.title,
          authorName: data.author_name,
          thumbnailUrl: data.thumbnail_url,
          html: data.html,
        };
      }
    } catch {
      // fall through to basic preview
    }
  }

  // Fallback: extract what we can from the URL itself
  const shortcode = extractInstagramShortcode(url);
  return {
    url,
    platform: 'instagram',
    title: shortcode ? `Instagram post` : undefined,
    thumbnailUrl: undefined,
    error: appId ? undefined : 'Add VITE_INSTAGRAM_CLIENT_TOKEN to .env for previews',
  };
}

async function fetchYouTubePreview(url: string): Promise<PostPreview> {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('YouTube oEmbed failed');
    const data = await res.json();
    return {
      url,
      platform: 'youtube',
      title: data.title,
      authorName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
    };
  } catch {
    return { url, platform: 'youtube', error: 'Could not load preview' };
  }
}

function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match?.[1] ?? null;
}

// ─── Main fetch ───────────────────────────────────────────────────────────────

export async function fetchPostPreview(url: string): Promise<PostPreview> {
  const platform = detectPlatform(url);
  switch (platform) {
    case 'instagram': return fetchInstagramPreview(url);
    case 'tiktok': return fetchTikTokPreview(url);
    case 'youtube': return fetchYouTubePreview(url);
    default: return { url, platform: 'unknown', error: 'Unsupported platform' };
  }
}

export async function fetchPostPreviews(urls: string[]): Promise<PostPreview[]> {
  return Promise.all(urls.map(fetchPostPreview));
}
