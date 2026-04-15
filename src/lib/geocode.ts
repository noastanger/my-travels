interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeCity(
  city: string,
  country: string
): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${city}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    const data: NominatimResult[] = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
