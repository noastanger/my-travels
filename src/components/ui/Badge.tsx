import { PlaceSource } from '../../types';
import { SourceIcon } from './SourceIcon';

const sourceColors: Record<PlaceSource, string> = {
  instagram: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  tiktok: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'google-maps': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  blog: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  other: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const sourceLabels: Record<PlaceSource, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  'google-maps': 'Google Maps',
  blog: 'Blog',
  other: 'Other',
};

interface BadgeProps {
  source: PlaceSource;
}

export function Badge({ source }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sourceColors[source]}`}
    >
      <SourceIcon source={source} size={12} />
      {sourceLabels[source]}
    </span>
  );
}
