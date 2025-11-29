'use client';

import { Users, Wallet, TrendingUp, Activity } from 'lucide-react';

interface StatsCardsProps {
  totalUsers: number;
  totalGroups: number;
  totalTransactions: number;
  totalVolume: number;
}

export default function StatsCards({
  totalUsers,
  totalGroups,
  totalTransactions,
  totalVolume
}: StatsCardsProps) {
  const stats = [
    {
      name: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Active Groups',
      value: totalGroups,
      icon: Wallet,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      name: 'Transactions',
      value: totalTransactions,
      icon: Activity,
      color: 'bg-green-500',
      change: '+23%',
    },
    {
      name: 'Total Volume',
      value: `${(totalVolume / 1000).toFixed(1)}K MAD`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+18%',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
