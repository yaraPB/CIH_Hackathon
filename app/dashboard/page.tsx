'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import BalanceCard from '@/components/BalanceCard';
import ActivityFeed from '@/components/ActivityFeed';
import { getCurrentUser, getUserGroups, mockTransactions, getUserById } from '@/lib/mockdb';

export default function DashboardPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [groups, setGroups] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const userGroups = getUserGroups(currentUser.id);
      setGroups(userGroups);

      // Get user's recent transactions
      const userTransactions = mockTransactions
        .filter(t => {
          const group = userGroups.find(g => g.id === t.groupId);
          return group !== undefined;
        })
        .slice(0, 5);
      
      setActivities(userTransactions);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in first</p>
      </div>
    );
  }

  const totalGroupBalance = groups.reduce((sum, g) => sum + g.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your group wallets and track shared expenses
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard
            title="Personal Balance"
            amount={user.balance}
            change={5.2}
            changeLabel="vs last month"
          />
          <BalanceCard
            title="Total Group Funds"
            amount={totalGroupBalance}
            change={12.8}
            changeLabel="vs last month"
          />
          <BalanceCard
            title="Active Groups"
            amount={groups.length}
          />
        </div>

        {/* Groups Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                description={group.description}
                memberCount={group.members.length}
                balance={group.balance}
                createdAt={group.createdAt}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <ActivityFeed activities={activities} />
        </div>
      </main>
    </div>
  );
}
