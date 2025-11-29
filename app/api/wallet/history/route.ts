import { NextRequest, NextResponse } from 'next/server';
import { mockTransactions, getUserById } from '@/lib/mockdb';

export async function GET(request: NextRequest) {
  try {
    const contractId = request.nextUrl.searchParams.get('contractid');
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }

    // Get transactions and format them
    const transactions = mockTransactions.map(txn => {
      const proposer = getUserById(txn.proposedBy);
      return {
        amount: txn.amount.toFixed(2),
        Fees: txn.fees.toFixed(2),
        beneficiaryFirstName: proposer?.firstName || "Unknown",
        beneficiaryLastName: proposer?.lastName || "User",
        beneficiaryRIB: null,
        clientNote: txn.description,
        contractId: null,
        currency: "MAD",
        date: new Date(txn.createdAt).toLocaleString(),
        dateToCompare: "0001-01-01T00:00:00Z",
        frais: [],
        numTel: null,
        operation: null,
        referenceId: txn.id,
        sign: null,
        srcDestNumber: proposer?.phoneNumber || "",
        status: txn.status === 'completed' ? '000' : '001',
        totalAmount: txn.amount.toFixed(2),
        totalFrai: txn.fees.toFixed(2),
        type: txn.type.toUpperCase(),
        isCanceled: false,
        isTierCashIn: false,
        totalPage: mockTransactions.length
      };
    });

    return NextResponse.json({ result: transactions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get transaction history' },
      { status: 500 }
    );
  }
}
