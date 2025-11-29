'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Map, Network, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const groupActivityData = stats.groupActivity.map((g: any) => ({
    name: g.name.substring(0, 15),
    balance: g.balance,
    transactions: g.transactionCount
  }));

  const statusData = [
    { name: 'Completed', value: stats.transactionStatus.completed, color: '#10b981' },
    { name: 'Pending', value: stats.transactionStatus.pending, color: '#f59e0b' },
    { name: 'Approved', value: stats.transactionStatus.approved, color: '#3b82f6' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Insights into user behavior and group activity
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <StatsCards
            totalUsers={stats.overview.totalUsers}
            totalGroups={stats.overview.totalGroups}
            totalTransactions={stats.overview.totalTransactions}
            totalVolume={stats.overview.totalVolume}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/analytics/map"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <Map className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Geographic Map</h3>
                <p className="text-sm text-gray-600 mt-1">
                  View user distribution across Morocco
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/analytics/graph"
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Network Graph</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Explore user and group relationships
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Group Activity */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Group Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="balance" fill="#6366f1" name="Balance (MAD)" />
                <Bar yAxisId="right" dataKey="transactions" fill="#8b5cf6" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction Status */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transaction Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Active Users
          </h3>
          <div className="space-y-3">
            {stats.userEngagement.slice(0, 5).map((user: any, index: number) => (
              <div key={user.userId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-400 w-8">
                    #{index + 1}
                  </span>
                  <span className="ml-4 text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(user.transactionCount / stats.userEngagement[0].transactionCount) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-20 text-right">
                    {user.transactionCount} txns
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
