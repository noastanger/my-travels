import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface MapClickHandlerProps {
  active: boolean;
  onMapClick: (latlng: LatLng) => void;
}

export function MapClickHandler({ active, onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (active) onMapClick(e.latlng);
    },
  });
  return null;
}
