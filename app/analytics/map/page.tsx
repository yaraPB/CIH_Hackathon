'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapPage() {
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    fetch('/api/analytics/location')
      .then(res => res.json())
      .then(data => {
        setLocationData(data);
        setLoading(false);
        setMapReady(true);
      })
      .catch(err => {
        console.error('Failed to load location data:', err);
        setLoading(false);
        setMapReady(true);
      });

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  if (loading || !mapReady) {
    return (
      <div className="min-h-screen bg-gradient-light">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Hotspot areas for Morocco cities with actual coordinates
  const hotspots = [
    { 
      city: 'Casablanca', 
      lat: 33.5731, 
      lng: -7.5898, 
      users: 2, 
      radius: 30000, // meters
      intensity: 0.8,
      color: '#dc2626'
    },
    { 
      city: 'Rabat', 
      lat: 34.0209, 
      lng: -6.8416, 
      users: 1, 
      radius: 20000,
      intensity: 0.5,
      color: '#ef4444'
    },
    { 
      city: 'Marrakech', 
      lat: 31.6295, 
      lng: -7.9811, 
      users: 1, 
      radius: 25000,
      intensity: 0.6,
      color: '#dc2626'
    },
    { 
      city: 'Tangier', 
      lat: 35.7595, 
      lng: -5.8340, 
      users: 1, 
      radius: 20000,
      intensity: 0.5,
      color: '#ef4444'
    },
    { 
      city: 'Salé', 
      lat: 34.0531, 
      lng: -6.7985, 
      users: 1, 
      radius: 15000,
      intensity: 0.4,
      color: '#f87171'
    }
  ];

  // Morocco center coordinates
  const moroccoCenter: [number, number] = [31.7917, -7.0926];

  return (
    <div className="min-h-screen bg-gradient-light">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/analytics"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Distribution Map</h1>
          <p className="text-gray-600 mt-1">
            Geographic spread and density of active users in Morocco
          </p>
        </div>

        {/* Map with Hotspot Areas */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Hotspots</h3>
          
          <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
              center={moroccoCenter}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Hotspot circles (red areas) */}
              {hotspots.map((spot, index) => (
                <div key={index}>
                  {/* Outer glow circle */}
                  <Circle
                    center={[spot.lat, spot.lng]}
                    radius={spot.radius * 1.5}
                    pathOptions={{
                      fillColor: spot.color,
                      fillOpacity: spot.intensity * 0.1,
                      color: spot.color,
                      opacity: 0.2,
                      weight: 1
                    }}
                  />
                  
                  {/* Middle circle */}
                  <Circle
                    center={[spot.lat, spot.lng]}
                    radius={spot.radius}
                    pathOptions={{
                      fillColor: spot.color,
                      fillOpacity: spot.intensity * 0.3,
                      color: spot.color,
                      opacity: 0.4,
                      weight: 1
                    }}
                  />
                  
                  {/* Core circle */}
                  <Circle
                    center={[spot.lat, spot.lng]}
                    radius={spot.radius * 0.5}
                    pathOptions={{
                      fillColor: spot.color,
                      fillOpacity: spot.intensity * 0.6,
                      color: spot.color,
                      opacity: 0.6,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <h4 className="font-bold text-gray-900">{spot.city}</h4>
                        <p className="text-sm text-gray-600">{spot.users} active users</p>
                        <p className="text-xs text-gray-500">
                          Activity level: {(spot.intensity * 100).toFixed(0)}%
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                </div>
              ))}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
              <span className="text-sm text-gray-600">High Activity</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
              <span className="text-sm text-gray-600">Medium Activity</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-200 mr-2"></div>
              <span className="text-sm text-gray-600">Low Activity</span>
            </div>
          </div>
        </div>

        {/* City Distribution Stats */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            City Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotspots.map((spot) => {
              const totalUsers = hotspots.reduce((sum, h) => sum + h.users, 0);
              const percentage = (spot.users / totalUsers) * 100;
              
              return (
                <div key={spot.city} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{spot.city}</span>
                    <span className="text-sm text-gray-600">{spot.users} users</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(1)}% of total
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
