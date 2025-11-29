import { NextRequest, NextResponse } from 'next/server';
import { generateOTP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = {
      result: [
        {
          codeOtp: generateOTP()
        }
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate OTP' },
      { status: 500 }
    );
  }
}
