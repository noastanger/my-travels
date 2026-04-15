import { create } from 'zustand';
import { Travel } from '../types';
import { generateId } from '../lib/utils';

const STORAGE_KEY = 'my-travels:travels';

function load(): Travel[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(travels: Travel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(travels));
}

interface TravelsStore {
  travels: Travel[];
  addTravel: (data: Omit<Travel, 'id' | 'createdAt'>) => Travel;
  removeTravel: (id: string) => void;
}

export const useTravelsStore = create<TravelsStore>((set, get) => ({
  travels: load(),

  addTravel(data) {
    const travel: Travel = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const travels = [travel, ...get().travels];
    save(travels);
    set({ travels });
    return travel;
  },

  removeTravel(id) {
    const travels = get().travels.filter((t) => t.id !== id);
    save(travels);
    set({ travels });
  },
}));
