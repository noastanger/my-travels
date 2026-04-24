import { Place } from '../../types';
import { PlaceListItem } from './PlaceListItem';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Plus, X, Link2 } from 'lucide-react';

interface PlaceSidebarProps {
  places: Place[];
  addMode: boolean;
  selectedPlaceId: string | null;
  onToggleAddMode: () => void;
  onSelectPlace: (id: string) => void;
  onRemovePlace: (id: string) => void;
  onImport: () => void;
}

export function PlaceSidebar({
  places,
  addMode,
  selectedPlaceId,
  onToggleAddMode,
  onSelectPlace,
  onRemovePlace,
  onImport,
}: PlaceSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-slate-900 border-l border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">
          Places{' '}
          <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-normal text-slate-400">
            {places.length}
          </span>
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onImport}
            className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Import from link"
          >
            <Link2 size={12} /> Import
          </button>
          <Button
            variant={addMode ? 'danger' : 'primary'}
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={onToggleAddMode}
          >
            {addMode ? (
              <><X size={13} /> Cancel</>
            ) : (
              <><Plus size={13} /> Add</>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {places.length === 0 ? (
          <EmptyState
            icon="📍"
            title="No places yet"
            description='Tap "Add" to pin a spot, or "Import" to bring in posts from Instagram or TikTok.'
          />
        ) : (
          <div className="space-y-1">
            {places.map((place) => (
              <PlaceListItem
                key={place.id}
                place={place}
                selected={selectedPlaceId === place.id}
                onSelect={() => onSelectPlace(place.id)}
                onRemove={() => onRemovePlace(place.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
