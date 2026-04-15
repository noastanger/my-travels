export type PlaceSource = 'instagram' | 'tiktok' | 'google-maps' | 'blog' | 'other';

export interface Place {
  id: string;
  travelId: string;
  name: string;
  notes?: string;
  url?: string;
  source: PlaceSource;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface Travel {
  id: string;
  city: string;
  country: string;
  coverEmoji?: string;
  centerLat: number;
  centerLng: number;
  createdAt: string;
}
