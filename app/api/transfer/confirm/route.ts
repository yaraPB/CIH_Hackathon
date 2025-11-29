import { NextRequest, NextResponse } from 'next/server';
import { generateReferenceId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = {
      result: {
        item1: {
          creditAmounts: null,
          debitAmounts: null,
          depot: null,
          retrait: null,
          value: `-${body.amount}`
        },
        item2: "000",
        item3: "Successful"
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to confirm transfer' },
      { status: 500 }
    );
  }
}
