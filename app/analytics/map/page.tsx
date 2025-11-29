'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import UserMap from '@/components/UserMap';

export default function MapPage() {
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/location')
      .then(res => res.json())
      .then(data => {
        setLocationData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load location data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/analytics"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Distribution Map</h1>
          <p className="text-gray-600 mt-1">
            Geographic spread and density of active users
          </p>
        </div>

        {locationData && (
          <>
            <div className="mb-8">
              <UserMap locations={locationData.locations} />
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                City Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationData.density.map((city: any) => (
                  <div key={city.city} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{city.city}</span>
                      <span className="text-sm text-gray-600">{city.count} users</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${city.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {city.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
