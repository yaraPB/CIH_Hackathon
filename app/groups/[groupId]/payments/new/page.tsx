'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { addTransaction, getGroupById, getCurrentUser } from '@/lib/mockdb';

export default function NewPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const group = getGroupById(groupId);
  const currentUser = getCurrentUser();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    beneficiary: '',
    type: 'payment' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    // Add the transaction
    addTransaction({
      groupId,
      type: formData.type,
      amount: parseFloat(formData.amount),
      fees: 0,
      status: 'pending',
      proposedBy: currentUser.id,
      approvedBy: [currentUser.id],
      requiredApprovals: Math.ceil((group?.members.length || 3) / 2),
      description: formData.description,
      beneficiary: formData.beneficiary || undefined
    });

    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={`/groups/${groupId}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Link>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Propose New Payment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="payment">Payment</option>
                <option value="cashout">Cash Out</option>
                <option value="w2w">Wallet Transfer</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (MAD)
              </label>
              <input
                type="number"
                id="amount"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
                Beneficiary (optional)
              </label>
              <input
                type="text"
                id="beneficiary"
                value={formData.beneficiary}
                onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href={`/groups/${groupId}`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Submit Proposal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
