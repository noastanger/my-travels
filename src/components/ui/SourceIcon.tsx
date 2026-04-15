import { Camera, Music2, Map, BookOpen, Star } from 'lucide-react';
import { PlaceSource } from '../../types';

const icons: Record<PlaceSource, typeof Camera> = {
  instagram: Camera,
  tiktok: Music2,
  'google-maps': Map,
  blog: BookOpen,
  other: Star,
};

interface SourceIconProps {
  source: PlaceSource;
  size?: number;
}

export function SourceIcon({ source, size = 16 }: SourceIconProps) {
  const Icon = icons[source];
  return <Icon size={size} />;
}
