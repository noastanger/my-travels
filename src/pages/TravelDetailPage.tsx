import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LatLng } from 'leaflet';
import { useTravelsStore } from '../store/useTravelsStore';
import { usePlacesStore } from '../store/usePlacesStore';
import { TravelMap } from '../components/map/TravelMap';
import { PlaceSidebar } from '../components/places/PlaceSidebar';
import { AddPlaceModal } from '../components/places/AddPlaceModal';
import { Button } from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { PlaceSource } from '../types';

export function TravelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const travel = useTravelsStore((s) => s.travels.find((t) => t.id === id));
  const places = usePlacesStore((s) => s.getPlacesForTravel(id ?? ''));
  const addPlace = usePlacesStore((s) => s.addPlace);
  const removePlace = usePlacesStore((s) => s.removePlace);

  const [addMode, setAddMode] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState<LatLng | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  if (!travel) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Travel not found.{' '}
        <button onClick={() => navigate('/')} className="ml-2 text-indigo-400 underline cursor-pointer">
          Go home
        </button>
      </div>
    );
  }

  function handleMapClick(latlng: LatLng) {
    setPendingLatLng(latlng);
    setModalOpen(true);
    setAddMode(false);
  }

  function handleAddPlace(data: {
    name: string;
    source: PlaceSource;
    url: string;
    notes: string;
    lat: number;
    lng: number;
  }) {
    addPlace({
      travelId: travel!.id,
      name: data.name,
      source: data.source,
      url: data.url || undefined,
      notes: data.notes || undefined,
      lat: data.lat,
      lng: data.lng,
    });
    setPendingLatLng(null);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-white/10 bg-slate-900/80 backdrop-blur z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" className="h-8 gap-1.5 px-3 text-xs" onClick={() => navigate('/')}>
            <ChevronLeft size={14} /> Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{travel.coverEmoji || '✈️'}</span>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{travel.city}</p>
              <p className="text-xs text-slate-400 leading-tight">{travel.country}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <TravelMap
            travel={travel}
            places={places}
            addMode={addMode}
            onMapClick={handleMapClick}
            onRemovePlace={removePlace}
            selectedPlaceId={selectedPlaceId}
          />
        </div>
        <div className="w-80 shrink-0 overflow-hidden">
          <PlaceSidebar
            places={places}
            addMode={addMode}
            selectedPlaceId={selectedPlaceId}
            onToggleAddMode={() => setAddMode((v) => !v)}
            onSelectPlace={setSelectedPlaceId}
            onRemovePlace={removePlace}
          />
        </div>
      </div>

      <AddPlaceModal
        open={modalOpen}
        lat={pendingLatLng?.lat ?? null}
        lng={pendingLatLng?.lng ?? null}
        travelId={travel.id}
        onClose={() => { setModalOpen(false); setPendingLatLng(null); }}
        onAdd={handleAddPlace}
      />
    </div>
  );
}
