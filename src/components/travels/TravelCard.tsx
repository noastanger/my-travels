import { useNavigate } from 'react-router-dom';
import { Travel } from '../../types';
import { usePlacesStore } from '../../store/usePlacesStore';
import { useTravelsStore } from '../../store/useTravelsStore';
import { formatDate } from '../../lib/utils';
import { MapPin, Trash2 } from 'lucide-react';

interface TravelCardProps {
  travel: Travel;
}

export function TravelCard({ travel }: TravelCardProps) {
  const navigate = useNavigate();
  const placeCount = usePlacesStore((s) => s.places.filter((p) => p.travelId === travel.id).length);
  const removeTravel = useTravelsStore((s) => s.removeTravel);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    removeTravel(travel.id);
  }

  return (
    <div
      onClick={() => navigate(`/travels/${travel.id}`)}
      className="group relative cursor-pointer rounded-2xl bg-slate-800 border border-white/10 p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-white/20"
    >
      <button
        onClick={handleDelete}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
        title="Delete travel"
      >
        <Trash2 size={15} />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-3xl">
          {travel.coverEmoji || '✈️'}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-white">{travel.city}</h3>
          <p className="text-sm text-slate-400">{travel.country}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin size={12} />
          <span>{placeCount} {placeCount === 1 ? 'place' : 'places'}</span>
        </div>
        <span className="text-xs text-slate-500">{formatDate(travel.createdAt)}</span>
      </div>
    </div>
  );
}
