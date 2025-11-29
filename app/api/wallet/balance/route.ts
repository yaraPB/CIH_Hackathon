import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockGroups } from '@/lib/mockdb';

export async function GET(request: NextRequest) {
  try {
    const contractId = request.nextUrl.searchParams.get('contractid');
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }

    // Check if it's a user or group contract
    const user = mockUsers.find(u => u.contractId === contractId);
    const group = mockGroups.find(g => g.contractId === contractId);
    
    const balance = user?.balance || group?.balance || 0;

    const response = {
      result: {
        balance: [
          {
            value: balance.toFixed(2)
          }
        ]
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get balance' },
      { status: 500 }
    );
  }
}
