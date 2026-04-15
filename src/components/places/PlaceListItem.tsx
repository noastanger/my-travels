import { Place } from '../../types';
import { Badge } from '../ui/Badge';
import { ExternalLink, Trash2 } from 'lucide-react';

interface PlaceListItemProps {
  place: Place;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function PlaceListItem({ place, selected, onSelect, onRemove }: PlaceListItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-xl p-3 transition-colors ${
        selected ? 'bg-indigo-500/20 ring-1 ring-indigo-500/40' : 'hover:bg-white/5'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{place.name}</p>
          <div className="mt-1.5">
            <Badge source={place.source} />
          </div>
          {place.notes && (
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">{place.notes}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {place.url && (
            <a
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 text-slate-400 hover:text-white"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="rounded p-1 text-slate-400 hover:text-red-400 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
