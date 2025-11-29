import { NextRequest, NextResponse } from 'next/server';
import { generateToken, generateOTP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock response based on API documentation
    const response = {
      result: {
        activityArea: null,
        addressLine1: body.clientAddress || "",
        addressLine2: null,
        addressLine3: null,
        addressLine4: null,
        agenceId: "211",
        averageIncome: null,
        birthDay: null,
        channelId: "P",
        city: null,
        country: null,
        dateOfBirth: body.dateOfBirth || "",
        distributeurId: "000104",
        documentExpiryDate1: null,
        documentExpiryDate2: null,
        documentScan1: "",
        documentScan2: "",
        documentType1: "",
        documentType2: null,
        email: body.email || "",
        familyStatus: null,
        firstName: body.clientFirstName || "User",
        fonction: null,
        gender: body.gender || "",
        institutionId: "0001",
        landLineNumber: null,
        lastName: body.clientLastName || "Test",
        legalId1: body.legalId || "",
        legalId2: null,
        level: null,
        mailaddress: null,
        mobileNumber: body.phoneNumber,
        nationalite: null,
        numberofchildren: null,
        optField1: null,
        optField2: null,
        otp: generateOTP(),
        phoneNumber: null,
        placeOfBirth: body.placeOfBirth || "",
        postCode: null,
        productId: "000",
        productTypeId: "000",
        profession: null,
        provider: body.phoneOperator || "IAM",
        raisonSocial: null,
        region: null,
        registrationDate: null,
        title: null,
        token: generateToken()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to precreate wallet' },
      { status: 500 }
    );
  }
}
