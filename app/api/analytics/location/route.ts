import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockdb';

export async function GET(request: NextRequest) {
  try {
    // Return user locations with density data
    const locationData = mockUsers
      .filter(user => user.location)
      .map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        lat: user.location!.lat,
        lng: user.location!.lng,
        city: user.location!.city,
        balance: user.balance
      }));

    // Calculate city density
    const cityDensity: Record<string, number> = {};
    locationData.forEach(loc => {
      cityDensity[loc.city] = (cityDensity[loc.city] || 0) + 1;
    });

    return NextResponse.json({
      locations: locationData,
      density: Object.entries(cityDensity).map(([city, count]) => ({
        city,
        count,
        percentage: (count / locationData.length) * 100
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get location data' },
      { status: 500 }
    );
  }
}
