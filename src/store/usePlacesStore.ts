import { create } from 'zustand';
import { Place } from '../types';
import { generateId } from '../lib/utils';

const STORAGE_KEY = 'my-travels:places';

function load(): Place[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(places: Place[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}

interface PlacesStore {
  places: Place[];
  getPlacesForTravel: (travelId: string) => Place[];
  addPlace: (data: Omit<Place, 'id' | 'createdAt'>) => Place;
  removePlace: (id: string) => void;
}

export const usePlacesStore = create<PlacesStore>((set, get) => ({
  places: load(),

  getPlacesForTravel(travelId) {
    return get().places.filter((p) => p.travelId === travelId);
  },

  addPlace(data) {
    const place: Place = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const places = [place, ...get().places];
    save(places);
    set({ places });
    return place;
  },

  removePlace(id) {
    const places = get().places.filter((p) => p.id !== id);
    save(places);
    set({ places });
  },
}));
