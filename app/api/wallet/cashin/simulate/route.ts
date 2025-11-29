import { NextRequest, NextResponse } from 'next/server';
import { generateToken, generateReferenceId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = {
      result: {
        Fees: body.fees || "0.0",
        feeDetail: "[{Nature:\"COM\",InvariantFee:0.000,VariantFee:0.0000000}]",
        token: generateToken(),
        amountToCollect: parseFloat(body.amount),
        isTier: true,
        cardId: body.contractId,
        transactionId: generateReferenceId(),
        benFirstName: "User",
        benLastName: "Name"
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to simulate cash in' },
      { status: 500 }
    );
  }
}
