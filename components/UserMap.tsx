'use client';

import { useEffect, useRef } from 'react';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  balance: number;
}

interface UserMapProps {
  locations: Location[];
}

export default function UserMap({ locations }: UserMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet only on client side
    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      // Create map centered on Morocco
      const map = L.map(mapRef.current).setView([31.7917, -7.0926], 6);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for each location
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${location.name}</h3>
            <p class="text-sm text-gray-600">${location.city}</p>
            <p class="text-sm font-medium text-indigo-600 mt-1">
              Balance: ${location.balance.toFixed(2)} MAD
            </p>
          </div>
        `);
      });

      // Cleanup
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    });
  }, [locations]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">User Distribution Map</h3>
        <p className="text-sm text-gray-600 mt-1">Geographic spread of active users</p>
      </div>
      <div ref={mapRef} className="h-96 w-full" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  );
}
