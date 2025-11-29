import { NextRequest, NextResponse } from 'next/server';
import { generateReferenceId } from '@/lib/utils';
import { getUserById } from '@/lib/mockdb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const destinationUser = getUserById(body.destinationUserId);
    
    const response = {
      result: {
        amount: body.amount,
        Fees: body.fees || "0.0",
        beneficiaryFirstName: destinationUser?.firstName || "Unknown",
        beneficiaryLastName: destinationUser?.lastName || "User",
        beneficiaryRIB: null,
        contractId: null,
        currency: "MAD",
        date: null,
        dateToCompare: "0001-01-01T00:00:00Z",
        frais: [
          {
            currency: "MAD",
            fullName: "",
            name: "COM",
            referenceId: generateReferenceId(),
            value: 0
          }
        ],
        numTel: null,
        operation: null,
        referenceId: generateReferenceId(),
        sign: null,
        srcDestNumber: null,
        status: null,
        totalAmount: body.amount,
        totalFrai: "0.00",
        type: "TT",
        isCanceled: false,
        isTierCashIn: false
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to simulate transfer' },
      { status: 500 }
    );
  }
}
