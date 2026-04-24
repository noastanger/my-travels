import { PostPreview } from '../../lib/oembed';
import { InstagramIcon, TikTokIcon } from '../onboarding/SocialIcons';
import { ExternalLink, MapPin, AlertCircle } from 'lucide-react';

function PlatformIcon({ platform }: { platform: PostPreview['platform'] }) {
  if (platform === 'instagram') return <InstagramIcon size={18} />;
  if (platform === 'tiktok') return <TikTokIcon size={18} />;
  if (platform === 'youtube') return <span className="text-sm">▶️</span>;
  return null;
}

interface PostReviewCardProps {
  post: PostPreview;
  selected: boolean;
  onToggle: () => void;
  locationOverride?: string;
  onLocationChange?: (val: string) => void;
}

export function PostReviewCard({
  post,
  selected,
  onToggle,
  locationOverride,
  onLocationChange,
}: PostReviewCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer rounded-2xl border transition-all overflow-hidden ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-800'
          : 'border-white/10 bg-slate-800/50 hover:border-white/20'
      }`}
    >
      {/* Selection indicator */}
      <div className={`absolute right-3 top-3 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
        selected ? 'border-indigo-500 bg-indigo-500' : 'border-white/30 bg-transparent'
      }`}>
        {selected && <span className="text-[10px] text-white font-bold">✓</span>}
      </div>

      {/* Thumbnail */}
      {post.thumbnailUrl ? (
        <div className="aspect-video w-full overflow-hidden bg-slate-700">
          <img
            src={post.thumbnailUrl}
            alt={post.title ?? 'Post thumbnail'}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <PlatformIcon platform={post.platform} />
        </div>
      )}

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <PlatformIcon platform={post.platform} />
          {post.authorName && (
            <span className="text-xs text-slate-400">@{post.authorName}</span>
          )}
        </div>

        {post.error ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <AlertCircle size={12} />
            <span>{post.error}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-300 line-clamp-2">
            {post.title ?? post.url}
          </p>
        )}

        {/* Location input */}
        {selected && (
          <div
            className="flex items-center gap-1.5 mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <input
              value={locationOverride ?? post.locationName ?? ''}
              onChange={(e) => onLocationChange?.(e.target.value)}
              placeholder="Add location name (e.g. Eiffel Tower)"
              className="flex-1 rounded-lg bg-slate-700 px-2 py-1 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Link */}
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:underline"
        >
          <ExternalLink size={10} /> View post
        </a>
      </div>
    </div>
  );
}
