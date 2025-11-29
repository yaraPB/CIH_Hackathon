import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockdb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = mockUsers.find(u => u.phoneNumber === body.phoneNumber);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const response = {
      result: {
        adressLine1: " ",
        city: user.location?.city || "",
        contractId: user.contractId,
        country: "MAR",
        description: null,
        email: user.email,
        numberOfChildren: null,
        phoneNumber: user.phoneNumber,
        pidNUmber: null,
        pidType: "",
        products: [
          {
            abbreviation: null,
            contractId: user.contractId,
            description: null,
            email: user.email,
            level: "",
            name: "CDP BASIC",
            phoneNumber: user.phoneNumber,
            productTypeId: "000",
            productTypeName: "PARTICULIER",
            provider: "ORANGE",
            rib: `${Math.floor(Math.random() * 1000000000000000000000000)}`,
            solde: user.balance.toFixed(2),
            statusId: "1",
            tierType: "03",
            uid: "000"
          }
        ],
        radical: "",
        soldeCumule: user.balance.toFixed(2),
        statusId: null,
        tierFirstName: user.firstName,
        tierId: `TR${Date.now()}`,
        tierLastName: user.lastName,
        userName: null,
        familyStatus: null
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get client info' },
      { status: 500 }
    );
  }
}
