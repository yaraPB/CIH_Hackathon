'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { addTransaction, getGroupById, getCurrentUser } from '@/lib/mockdb';

export default function PayPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const group = getGroupById(groupId);
  const currentUser = getCurrentUser();
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !group) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      addTransaction({
        groupId,
        type: 'cashin',
        amount: parseFloat(amount),
        fees: 0,
        status: 'completed',
        proposedBy: currentUser.id,
        approvedBy: [currentUser.id],
        requiredApprovals: 1,
        description: `Contribution to ${group.name}`
      });

      router.push(`/groups/${groupId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={`/groups/${groupId}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Link>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Contribute to {group?.name}
          </h1>
          <p className="text-gray-600 mb-8">
            Add funds to this group wallet
          </p>

          <form onSubmit={handleContribute} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (MAD)
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  id="amount"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full text-3xl border border-gray-300 rounded-md shadow-sm py-4 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Current group balance: {group?.balance.toFixed(2)} MAD
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Transaction Details
              </h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-blue-700">Amount:</dt>
                  <dd className="font-medium text-blue-900">
                    {parseFloat(amount || '0').toFixed(2)} MAD
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-blue-700">Fees:</dt>
                  <dd className="font-medium text-blue-900">0.00 MAD</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <dt className="font-medium text-blue-900">Total:</dt>
                  <dd className="font-bold text-blue-900">
                    {parseFloat(amount || '0').toFixed(2)} MAD
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href={`/groups/${groupId}`}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !amount}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Contribute Now'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
