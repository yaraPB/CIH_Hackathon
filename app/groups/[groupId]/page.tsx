'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Users, Wallet } from 'lucide-react';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import ActivityFeed from '@/components/ActivityFeed';
import { getGroupById, getGroupTransactions, getUserById } from '@/lib/mockdb';
import Link from 'next/link';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const groupData = getGroupById(groupId);
    if (groupData) {
      setGroup(groupData);
      
      const memberData = groupData.members
        .map(memberId => getUserById(memberId))
        .filter(Boolean);
      setMembers(memberData);
      
      const groupTxns = getGroupTransactions(groupId);
      setTransactions(groupTxns);
    }
  }, [groupId]);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {group.name}
          </h1>
          <p className="text-gray-600 mt-1">{group.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard
            title="Group Balance"
            amount={group.balance}
          />
          <BalanceCard
            title="Total Members"
            amount={members.length}
          />
          <BalanceCard
            title="Total Transactions"
            amount={transactions.length}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href={`/groups/${groupId}/pay`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Make Payment
          </Link>
          <Link
            href={`/groups/${groupId}/payments/new`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Propose Payment
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Members
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {members.map(member => (
                  <div key={member.id} className="p-4">
                    <p className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{member.phoneNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}
