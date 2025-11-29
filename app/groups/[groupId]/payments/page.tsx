'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getGroupTransactions, approveTransaction, getCurrentUser, getUserById } from '@/lib/mockdb';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PaymentsPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const currentUser = getCurrentUser();
  
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const txns = getGroupTransactions(groupId);
    setTransactions(txns);
  }, [groupId]);

  const handleApprove = (txnId: string) => {
    if (!currentUser) return;
    
    const success = approveTransaction(txnId, currentUser.id);
    if (success) {
      const txns = getGroupTransactions(groupId);
      setTransactions(txns);
    }
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending' || t.status === 'approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={`/groups/${groupId}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Pending Payments
        </h1>

        <div className="space-y-4">
          {pendingTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No pending payments</p>
            </div>
          ) : (
            pendingTransactions.map(txn => {
              const proposer = getUserById(txn.proposedBy);
              const hasApproved = currentUser && txn.approvedBy.includes(currentUser.id);
              
              return (
                <div key={txn.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {txn.description}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Proposed by {proposer?.firstName} {proposer?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(txn.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {formatCurrency(txn.amount)}
                      </p>
                      {txn.beneficiary && (
                        <p className="text-sm text-gray-600 mt-1">
                          To: {txn.beneficiary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">
                        Approvals: {txn.approvedBy.length} / {txn.requiredApprovals}
                      </p>
                      <div className="flex -space-x-2 mt-2">
                        {txn.approvedBy.map((userId: string) => {
                          const user = getUserById(userId);
                          return (
                            <div
                              key={userId}
                              className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                              title={`${user?.firstName} ${user?.lastName}`}
                            >
                              {user?.firstName.charAt(0)}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {!hasApproved && (
                      <button
                        onClick={() => handleApprove(txn.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                    )}

                    {hasApproved && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Check className="h-4 w-4 mr-1" />
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
