import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { Place, Travel } from '../../types';
import { MapClickHandler } from './MapClickHandler';
import { Badge } from '../ui/Badge';
import { ExternalLink, Trash2 } from 'lucide-react';

function MapInvalidator({ centerLat, centerLng }: { centerLat: number; centerLng: number }) {
  const map = useMap();
  useEffect(() => {
    // Force Leaflet to recalculate its size after the container renders
    setTimeout(() => {
      map.invalidateSize();
      if (centerLat !== 0 || centerLng !== 0) {
        map.setView([centerLat, centerLng], map.getZoom());
      }
    }, 100);
  }, [map, centerLat, centerLng]);
  return null;
}

const sourceColors: Record<Place['source'], string> = {
  instagram: '#f472b6',
  tiktok: '#22d3ee',
  'google-maps': '#60a5fa',
  blog: '#fbbf24',
  other: '#94a3b8',
};

interface TravelMapProps {
  travel: Travel;
  places: Place[];
  addMode: boolean;
  onMapClick: (latlng: LatLng) => void;
  onRemovePlace: (id: string) => void;
  selectedPlaceId?: string | null;
}

export function TravelMap({
  travel,
  places,
  addMode,
  onMapClick,
  onRemovePlace,
  selectedPlaceId,
}: TravelMapProps) {
  return (
    <div className={`relative h-full w-full ${addMode ? 'cursor-crosshair' : ''}`}>
      {addMode && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-lg">
          Click on the map to pick a location
        </div>
      )}
      <MapContainer
        center={[travel.centerLat, travel.centerLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapInvalidator centerLat={travel.centerLat} centerLng={travel.centerLng} />
        <MapClickHandler active={addMode} onMapClick={onMapClick} />
        {places.map((place) => (
          <CircleMarker
            key={place.id}
            center={[place.lat, place.lng]}
            radius={selectedPlaceId === place.id ? 12 : 9}
            pathOptions={{
              fillColor: sourceColors[place.source],
              fillOpacity: 0.9,
              color: '#fff',
              weight: selectedPlaceId === place.id ? 3 : 2,
            }}
          >
            <Popup>
              <div className="min-w-[180px] space-y-2 p-1">
                <p className="font-semibold text-slate-800">{place.name}</p>
                <Badge source={place.source} />
                {place.notes && (
                  <p className="text-xs text-slate-500">{place.notes}</p>
                )}
                {place.url && (
                  <a
                    href={place.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                  >
                    <ExternalLink size={11} /> Open link
                  </a>
                )}
                <button
                  onClick={() => onRemovePlace(place.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 size={11} /> Remove
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
