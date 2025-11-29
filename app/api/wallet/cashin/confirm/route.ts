import { NextRequest, NextResponse } from 'next/server';
import { generateReferenceId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = {
      result: {
        Fees: body.fees || "0.0",
        feeDetails: null,
        token: body.token,
        amount: parseFloat(body.amount),
        transactionReference: generateReferenceId(),
        optFieldOutput1: null,
        optFieldOutput2: null,
        cardId: body.contractId || ""
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to confirm cash in' },
      { status: 500 }
    );
  }
}
